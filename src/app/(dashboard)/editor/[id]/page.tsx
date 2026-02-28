import { redirect } from "next/navigation";

interface EditorRedirectPageProps {
  params: {
    id: string;
  };
}

export default function EditorRedirectPage({ params }: EditorRedirectPageProps) {
  redirect(`/editor?id=${params.id}`);
}
