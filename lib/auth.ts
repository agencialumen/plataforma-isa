import { supabase } from "./supabase"
import type { UserSubscription } from "./supabase"

export const authService = {
  // Registrar usuário após pagamento confirmado
  async signUpWithPayment(email: string, password: string, paymentId: string) {
    try {
      // Primeiro, verificar se o pagamento existe e foi confirmado
      const { data: subscription, error: subError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("payment_id", paymentId)
        .eq("payment_status", "completed")
        .single()

      if (subError || !subscription) {
        throw new Error("Pagamento não encontrado ou não confirmado")
      }

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Desabilita verificação de email
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Atualizar a assinatura com o user_id
        const { error: updateError } = await supabase
          .from("user_subscriptions")
          .update({ user_id: authData.user.id })
          .eq("payment_id", paymentId)

        if (updateError) throw updateError

        // Registrar analytics
        await this.logUserAction(authData.user.id, "user_registered", "/auth/signup")
      }

      return { user: authData.user, subscription }
    } catch (error) {
      console.error("Erro no registro:", error)
      throw error
    }
  },

  // Login do usuário
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Registrar analytics
        await this.logUserAction(data.user.id, "user_login", "/auth/signin")
      }

      return data
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Verificar se usuário tem assinatura ativa
  async checkUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("subscription_status", "active")
        .single()

      if (error && error.code !== "PGRST116") throw error
      return data
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error)
      return null
    }
  },

  // Registrar ação do usuário para analytics
  async logUserAction(userId: string, action: string, page?: string, metadata?: any) {
    try {
      const { error } = await supabase.from("user_analytics").insert({
        user_id: userId,
        action,
        page,
        metadata,
      })

      if (error) console.error("Erro ao registrar analytics:", error)
    } catch (error) {
      console.error("Erro ao registrar analytics:", error)
    }
  },

  // Criar registro de pagamento pendente
  async createPendingPayment(email: string, plan: string, paymentId: string, amount: number) {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert({
          email,
          subscription_plan: plan,
          payment_id: paymentId,
          payment_status: "pending",
          payment_amount: amount,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao criar pagamento pendente:", error)
      throw error
    }
  },

  // Confirmar pagamento (webhook)
  async confirmPayment(paymentId: string) {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ payment_status: "completed" })
        .eq("payment_id", paymentId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error)
      throw error
    }
  },
}
