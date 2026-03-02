import { studies } from '@/data/studies'
import { notFound } from 'next/navigation'
import { StudyNav } from '@/components/layout/StudyNav'

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function StudyLayout({ children, params }: Props) {
  const { id } = await params
  const study = studies.find(s => s.id === id)
  if (!study) notFound()

  return (
    <div>
      <StudyNav studyId={id} studyName={study.name} />
      <div className="pt-4">{children}</div>
    </div>
  )
}
