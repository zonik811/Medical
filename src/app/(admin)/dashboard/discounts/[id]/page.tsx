"use client";

import { use } from "react";
import DiscountForm from "@/components/admin/discount-form";

export default function EditDiscountPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    return <DiscountForm discountId={id} />;
}
