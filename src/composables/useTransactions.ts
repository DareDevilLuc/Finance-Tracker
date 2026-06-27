import { supabase } from "@/utils/supabase";
import { useAuth } from "./useAuth";

const { user } = useAuth()

export function useTransactions() {

    const fetchTransactions = async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('date, type, amount, description')
            .eq('user_id', user.value?.id)
            .order('date', { ascending: true })

        if (error) throw error

        return data
    }

    const newTransaction = async (amount: string, type: string, dateSubmitted: string, description: string) => {

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.value?.id,
                amount: amount,
                type: type,
                date: dateSubmitted,
                description: description
            })
            .select()

        if (error) throw error

        return data[0] // returns only inserted row
    }

    return { fetchTransactions, newTransaction }
}