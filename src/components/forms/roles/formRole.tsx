"use client";

import { AddUpdateRoleItem } from "@/services/roles/rolesServices";
import { FC } from "react";

interface FormRoleProps {
  onSubmit: (formData: Partial<AddUpdateRoleItem>) => void;
  initialData?: Partial<AddUpdateRoleItem>;
  mode: "add" | "edit";
}

const FormRole: FC<FormRoleProps> = ({ onSubmit, initialData, mode }) => {
  return (
    <div>
      <h1>FormRole</h1>
    </div>
  );
};

export default FormRole;
