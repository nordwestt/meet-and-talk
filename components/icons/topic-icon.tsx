import {
  BookOpen,
  Camera,
  Cpu,
  Dices,
  Globe2,
  Handshake,
  MessagesSquare,
  Rocket,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  MessagesSquare,
  Rocket,
  Globe2,
  BookOpen,
  Cpu,
  Handshake,
  Dices,
  Camera,
}

export function TopicIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = iconMap[name] ?? Sparkles
  return <Icon className={className} aria-hidden="true" />
}
