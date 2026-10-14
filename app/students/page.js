import StudentShowcaseHome from '@/components/student-showcase/app/page';

export const metadata = {
  title: "PIBI TECH | Student Project Showcase 2026 — Win Top 3 Prizes & Launch on PiBi Open Intelligence",
  description:
    "PIBI TECH National Student Project Showcase and Awards. Compete for Top 3 cash prizes and get your project officially published and featured on PiBi Open Intelligence.",
  keywords: [
    "PIBI TECH",
    "student projects",
    "PiBi Open Intelligence",
    "project showcase",
    "student innovation",
    "cash prizes",
  ],
  robots: {
    index: false,
    follow: true,
  },
};

export default function StudentsPage() {
  return <StudentShowcaseHome />;
}
