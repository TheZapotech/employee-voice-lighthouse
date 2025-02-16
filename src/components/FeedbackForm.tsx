
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  content: z.string().min(1, "Il contenuto è obbligatorio"),
  is_anonymous: z.boolean().default(false),
});

export const FeedbackForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      is_anonymous: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { data: feedback, error } = await supabase
        .from("feedback")
        .insert({
          title: values.title,
          content: values.content,
          is_anonymous: values.is_anonymous,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Analizza il sentiment usando l'Edge Function
      const { error: sentimentError } = await supabase.functions.invoke("analyze-sentiment", {
        body: {
          feedback_id: feedback.id,
          content: values.content,
        },
      });

      if (sentimentError) {
        console.error("Errore nell'analisi del sentiment:", sentimentError);
      }

      form.reset();
      toast({
        title: "Feedback inviato",
        description: "Grazie per il tuo feedback!",
      });
    } catch (error) {
      console.error("Errore nell'invio del feedback:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore nell'invio del feedback.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci un titolo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Scrivi qui il tuo feedback..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Invia in modo anonimo</FormLabel>
                <FormDescription>
                  Il tuo feedback sarà completamente anonimo
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Invio in corso..." : "Invia feedback"}
        </Button>
      </form>
    </Form>
  );
};
