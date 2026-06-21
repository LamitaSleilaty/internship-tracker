"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

/* -------------------------
   ADD INTERNSHIP
--------------------------*/
export async function addInternship(formData: FormData) {
  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;
  const user_id = formData.get("user_id") as string;

  const { error } = await supabase.from("internships").insert([
    {
      company,
      position,
      location,
      status,
      user_id,
    },
  ]);

  if (error) {
    console.log("INSERT ERROR:", error);
  }

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