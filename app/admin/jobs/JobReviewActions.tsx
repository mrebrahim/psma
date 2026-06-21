"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobReviewActions({ jobId, status }: { jobId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  async function approve() {
    if (!confirm("اعتماد الوظيفة ونشرها؟")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/jobs/${jobId}/approve`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("فشل: " + (await res.text()));
  }

  async function reject() {
    if (!reason.trim()) {
      alert("اكتب سبب الرفض.");
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/jobs/${jobId}/reject`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: reason.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      setShowReject(false);
      setReason("");
      router.refresh();
    } else alert("فشل: " + (await res.text()));
  }

  async function remove() {
    if (!confirm("حذف الوظيفة وكل التقديمات عليها نهائيًا؟")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/jobs/${jobId}/delete`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("فشل: " + (await res.text()));
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-start">
      {status !== "published" && (
        <button onClick={approve} disabled={busy} className="btn-primary text-sm disabled:opacity-60">
          ✓ موافقة ونشر
        </button>
      )}
      {status !== "rejected" && !showReject && (
        <button
          onClick={() => setShowReject(true)}
          disabled={busy}
          className="bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 text-sm disabled:opacity-60"
        >
          ✕ رفض
        </button>
      )}
      <button
        onClick={remove}
        disabled={busy}
        className="border border-red-300 text-red-700 font-bold px-4 py-2 rounded-full hover:bg-red-50 text-sm disabled:opacity-60"
      >
        🗑 حذف
      </button>
      {showReject && (
        <div className="w-full mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <label className="label">سبب الرفض (هيظهر للشركة)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="textarea"
            placeholder="مثال: الوصف الوظيفي غير واضح، أو السن المطلوب مش متناسب..."
          />
          <div className="flex gap-2 mt-2">
            <button onClick={reject} disabled={busy} className="bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 text-sm disabled:opacity-60">
              تأكيد الرفض
            </button>
            <button onClick={() => { setShowReject(false); setReason(""); }} className="btn-outline text-sm">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
