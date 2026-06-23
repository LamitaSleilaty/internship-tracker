"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

/* -------------------------
   ADD INTERNSHIP
--------------------------*/
export async function addInternship(data: any) {
  console.log("🔥 addInternship CALLED");
  console.log("DATA RECEIVED:", data);

  const { error } = await supabase.from("internships").insert([
    {
      company: data.company,
      position: data.position,
      location: data.location,
      status: data.status,
      user_id: data.user_id,
      cv_url: data.cv_url || null,
    },
  ]);

  if (error) {
    console.log("❌ SUPABASE INSERT ERROR:", error);
    return;
  }

  console.log("✅ INSERT SUCCESS");

  revalidatePath("/internships");
  revalidatePath("/dashboard");
}

/* -------------------------
   DELETE INTERNSHIP
--------------------------*/
export async function deleteInternship(id: string) {
  const { error } = await supabase
    .from("internships")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("DELETE ERROR:", error);
  }

  revalidatePath("/internships");
  revalidatePath("/dashboard");
}

/* -------------------------
   UPDATE STATUS
--------------------------*/
export async function updateInternshipStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("internships")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log("UPDATE ERROR:", error);
  }

  revalidatePath("/internships");
  revalidatePath("/dashboard");
}