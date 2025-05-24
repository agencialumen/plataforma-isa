const { createClient } = require("@supabase/supabase-js")

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }

  // Responder OPTIONS para CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    }
  }

  try {
    console.log("🔄 Webhook recebido:", event.httpMethod)

    // Verificar se é POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Método não permitido" }),
      }
    }

    // Verificar token de segurança
    const receivedToken = event.headers.token || event.headers.Token
    const expectedToken = process.env.KIRVANO_TOKEN

    console.log("🔐 Verificando token...")
    console.log("Token recebido:", receivedToken ? "Presente" : "Ausente")
    console.log("Token esperado:", expectedToken ? "Configurado" : "Não configurado")

    if (!expectedToken) {
      console.error("❌ KIRVANO_TOKEN não configurado")
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Token não configurado no servidor" }),
      }
    }

    if (receivedToken !== expectedToken) {
      console.error("❌ Token inválido")
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Token inválido" }),
      }
    }

    console.log("✅ Token válido")

    // Parse do body
    let body
    try {
      body = JSON.parse(event.body)
      console.log("📦 Body recebido:", body)
    } catch (error) {
      console.error("❌ Erro ao fazer parse do JSON:", error)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "JSON inválido" }),
      }
    }

    // Verificar se o pagamento foi aprovado
    if (body.payment_status !== "paid") {
      console.log("⏳ Pagamento não aprovado ainda:", body.payment_status)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Pagamento não aprovado ainda" }),
      }
    }

    console.log("💰 Pagamento aprovado para:", body.email)

    // Configurar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Variáveis do Supabase não configuradas")
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Supabase não configurado" }),
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Determinar o plano baseado no valor ou produto
    let plan = "premium" // padrão
    if (body.amount) {
      const amount = Number.parseFloat(body.amount)
      if (amount <= 20) plan = "basic"
      else if (amount <= 30) plan = "premium"
      else plan = "diamond"
    }

    // Verificar se já existe uma assinatura para este email
    console.log("🔍 Verificando assinatura existente...")
    const { data: existingSubscription, error: checkError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("email", body.email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Erro ao verificar assinatura:", checkError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro ao verificar assinatura" }),
      }
    }

    if (existingSubscription) {
      // Atualizar assinatura existente
      console.log("🔄 Atualizando assinatura existente...")
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          payment_status: "completed",
          subscription_status: "active",
          payment_date: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          updated_at: new Date().toISOString(),
        })
        .eq("email", body.email)

      if (updateError) {
        console.error("❌ Erro ao atualizar assinatura:", updateError)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Erro ao atualizar assinatura" }),
        }
      }

      console.log("✅ Assinatura atualizada com sucesso")
    } else {
      // Criar nova assinatura
      console.log("➕ Criando nova assinatura...")
      const { error: insertError } = await supabase.from("user_subscriptions").insert({
        email: body.email,
        subscription_plan: plan,
        payment_id: body.transaction_id || `kirvano_${Date.now()}`,
        payment_status: "completed",
        payment_amount: Number.parseFloat(body.amount || "29.90"),
        payment_date: new Date().toISOString(),
        subscription_status: "active",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      })

      if (insertError) {
        console.error("❌ Erro ao criar assinatura:", insertError)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Erro ao criar assinatura" }),
        }
      }

      console.log("✅ Nova assinatura criada com sucesso")
    }

    // Resposta de sucesso
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Acesso liberado com sucesso",
        email: body.email,
        plan: plan,
      }),
    }
  } catch (error) {
    console.error("❌ Erro geral no webhook:", error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno do servidor",
        details: error.message,
      }),
    }
  }
}
