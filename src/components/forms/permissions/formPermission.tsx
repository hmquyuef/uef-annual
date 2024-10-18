"use client";

import { AddUpdatePermissionItem } from "@/services/permissions/permissionServices";
import { FC } from "react";

interface FormPermissionProps {
  onSubmit: (formData: Partial<AddUpdatePermissionItem>) => void;
  initialData?: Partial<AddUpdatePermissionItem>;
  mode: "add" | "edit";
}

const FormPermission: FC<FormPermissionProps> = ({
  onSubmit,
  initialData,
  mode,
}) => {
  return (
    <div>
      <h1>FormPermission</h1>
    </div>
  );
};

export default FormPermission;
