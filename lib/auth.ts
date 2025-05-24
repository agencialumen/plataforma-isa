import { supabase } from "./supabase"
import type { UserSubscription } from "./supabase"

// Verificar se o Supabase está disponível
const checkSupabaseAvailable = () => {
  if (!supabase) {
    throw new Error("❌ Supabase não está configurado. Verifique as variáveis de ambiente.")
  }
  return true
}

export const authService = {
  // Registrar usuário (sem criar assinatura - será criada pelo webhook)
  async signUp(email: string, password: string) {
    try {
      checkSupabaseAvailable()

      console.log("🔄 Criando usuário:", email)

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Desabilita verificação de email
        },
      })

      if (authError) {
        console.error("❌ Erro na criação:", authError)
        throw authError
      }

      console.log("✅ Usuário criado:", authData.user?.id)

      if (authData.user) {
        // Registrar analytics
        await this.logUserAction(authData.user.id, "user_registered", "/auth/signup")
      }

      return authData
    } catch (error) {
      console.error("❌ Erro no registro:", error)
      throw error
    }
  },

  // Login do usuário
  async signIn(email: string, password: string) {
    try {
      checkSupabaseAvailable()

      console.log("🔄 Fazendo login:", email)

      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("❌ Erro no login:", error)
        throw error
      }

      console.log("✅ Login realizado:", data.user?.id)

      if (data.user) {
        // Verificar se tem assinatura ativa
        const subscription = await this.checkUserSubscription(data.user.id)
        if (!subscription) {
          // Verificar por email se não encontrou por user_id
          const subscriptionByEmail = await this.checkSubscriptionByEmail(data.user.email!)
          if (subscriptionByEmail) {
            // Associar assinatura ao usuário
            await this.linkSubscriptionToUser(data.user.id, data.user.email!)
          }
        }

        // Registrar analytics
        await this.logUserAction(data.user.id, "user_login", "/auth/signin")
      }

      return data
    } catch (error) {
      console.error("❌ Erro no login:", error)
      throw error
    }
  },

  // Logout
  async signOut() {
    try {
      checkSupabaseAvailable()
      const { error } = await supabase!.auth.signOut()
      if (error) throw error
      console.log("✅ Logout realizado")
    } catch (error) {
      console.error("❌ Erro no logout:", error)
      throw error
    }
  },

  // Verificar se usuário tem assinatura ativa por user_id
  async checkUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      checkSupabaseAvailable()

      console.log("🔄 Verificando assinatura por user_id:", userId)

      const { data, error } = await supabase!
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("subscription_status", "active")
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("❌ Erro na verificação:", error)
        return null
      }

      console.log("✅ Assinatura encontrada:", data?.subscription_plan)
      return data
    } catch (error) {
      console.error("❌ Erro ao verificar assinatura:", error)
      return null
    }
  },

  // Verificar assinatura por email
  async checkSubscriptionByEmail(email: string): Promise<UserSubscription | null> {
    try {
      checkSupabaseAvailable()

      console.log("🔄 Verificando assinatura por email:", email)

      const { data, error } = await supabase!
        .from("user_subscriptions")
        .select("*")
        .eq("email", email)
        .eq("subscription_status", "active")
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("❌ Erro na verificação por email:", error)
        return null
      }

      console.log("✅ Assinatura encontrada por email:", data?.subscription_plan)
      return data
    } catch (error) {
      console.error("❌ Erro ao verificar assinatura por email:", error)
      return null
    }
  },

  // Associar assinatura ao usuário
  async linkSubscriptionToUser(userId: string, email: string) {
    try {
      checkSupabaseAvailable()

      console.log("🔗 Associando assinatura ao usuário:", userId, email)

      const { error } = await supabase!
        .from("user_subscriptions")
        .update({ user_id: userId })
        .eq("email", email)
        .is("user_id", null)

      if (error) {
        console.error("❌ Erro ao associar assinatura:", error)
        return false
      }

      console.log("✅ Assinatura associada com sucesso")
      return true
    } catch (error) {
      console.error("❌ Erro ao associar assinatura:", error)
      return false
    }
  },

  // Registrar ação do usuário para analytics
  async logUserAction(userId: string, action: string, page?: string, metadata?: any) {
    try {
      if (!supabase) return // Falha silenciosa se Supabase não estiver disponível

      const { error } = await supabase.from("user_analytics").insert({
        user_id: userId,
        action,
        page,
        metadata,
      })

      if (error) console.error("❌ Erro ao registrar analytics:", error)
    } catch (error) {
      console.error("❌ Erro ao registrar analytics:", error)
    }
  },
}
