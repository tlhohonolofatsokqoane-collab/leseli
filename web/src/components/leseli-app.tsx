"use client"

import Image from "next/image"
import {
  ArrowRight,
  Building2,
  Check,
  Menu,
  Search,
  X,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Grade = "A*" | "A" | "B" | "C" | "D" | "E" | ""

type Requirement = {
  subject: string
  min: Exclude<Grade, "">
}

type Programme = {
  title: string
  institution: string
  field: string
  duration: string
  aps?: number
  requirements: Requirement[]
  note: string
}

const gradePoints: Record<Grade, number> = {
  "A*": 8,
  A: 7,
  B: 6,
  C: 5,
  D: 4,
  E: 3,
  "": 0,
}

const gradeOptions: Exclude<Grade, "">[] = ["A*", "A", "B", "C", "D", "E"]

const coreSubjects = [
  "English",
  "Sesotho",
  "Mathematics",
  "Physical Science",
  "Biology",
]

const otherSubjects = [
  "Accounting",
  "Business Studies",
  "Economics",
  "Geography",
  "Computer Studies",
  "Agriculture",
  "Literature",
]

const matcherSubjects = [...coreSubjects, ...otherSubjects]
const firstOtherSubjectIndex = coreSubjects.length

const initialGrades: Record<string, Grade> = {
  English: "",
  Sesotho: "",
  Mathematics: "",
  "Physical Science": "",
  Biology: "",
  Accounting: "",
  "Business Studies": "",
  Economics: "",
  Geography: "",
  "Computer Studies": "",
  Agriculture: "",
  Literature: "",
}

const programmes: Programme[] = [
  {
    title: "Computer Science",
    institution: "National University of Lesotho",
    field: "technology software computing",
    duration: "4 years",
    aps: 28,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "C" },
      { subject: "Physical Science", min: "C" },
    ],
    note: "Build software, understand systems, and learn how digital products work.",
  },
  {
    title: "General Nursing",
    institution: "National Health Training College",
    field: "health nursing medicine care biology",
    duration: "3 years",
    aps: 26,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Biology", min: "C" },
      { subject: "Physical Science", min: "D" },
      { subject: "Mathematics", min: "D" },
    ],
    note: "A science-led route for students drawn to care, hospitals, and community health.",
  },
  {
    title: "Civil Engineering",
    institution: "Lerotholi Polytechnic",
    field: "engineering construction maths science infrastructure",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "D" },
      { subject: "Mathematics", min: "C" },
      { subject: "Physical Science", min: "C" },
    ],
    note: "Design and build the roads, structures, and infrastructure people use every day.",
  },
  {
    title: "Law",
    institution: "National University of Lesotho",
    field: "law policy writing justice humanities",
    duration: "5 years",
    aps: 26,
    requirements: [
      { subject: "English", min: "B" },
      { subject: "Sesotho", min: "C" },
    ],
    note: "For strong readers and writers who enjoy argument, policy, and public life.",
  },
  {
    title: "Accounting and Finance",
    institution: "Centre for Accounting Studies",
    field: "accounting finance business economics money",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "C" },
      { subject: "Accounting", min: "C" },
    ],
    note: "A practical professional path for students who like numbers and business rules.",
  },
  {
    title: "Business Management",
    institution: "Botho University Lesotho",
    field: "business entrepreneurship management economics",
    duration: "4 years",
    aps: 22,
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Mathematics", min: "D" },
    ],
    note: "A flexible route into operations, startups, sales, finance, or management.",
  },
  {
    title: "Secondary Teaching",
    institution: "Lesotho College of Education",
    field: "teaching education humanities science",
    duration: "3 years",
    requirements: [
      { subject: "English", min: "C" },
      { subject: "Sesotho", min: "C" },
    ],
    note: "A good fit for students who want to teach and have two strong subject areas.",
  },
  {
    title: "Creative Design",
    institution: "Limkokwing University",
    field: "design media art animation creative technology",
    duration: "4 years",
    requirements: [{ subject: "English", min: "D" }],
    note: "For visual thinkers who want to make media, brands, interfaces, or stories.",
  },
]

const institutions = [
  "NUL",
  "Lerotholi Polytechnic",
  "Botho University",
  "Limkokwing",
  "NHTC",
  "LCE",
  "CAS",
  "IDM Lesotho",
  "LAC",
  "LIPAM",
]

const institutionRows = [
  institutions.slice(0, Math.ceil(institutions.length / 2)),
  institutions.slice(Math.ceil(institutions.length / 2)),
]

function minGradeLabel(requirement: Requirement) {
  return `${requirement.subject} ${requirement.min}+`
}

function calculateAps(grades: Record<string, Grade>) {
  return Object.values(grades)
    .map((grade) => gradePoints[grade])
    .sort((a, b) => b - a)
    .slice(0, 6)
    .reduce((sum, value) => sum + value, 0)
}

function evaluateProgramme(programme: Programme, grades: Record<string, Grade>) {
  const missingSubjects = programme.requirements.filter((requirement) => {
    const studentGrade = grades[requirement.subject] ?? ""

    return gradePoints[studentGrade] < gradePoints[requirement.min]
  })
  const aps = calculateAps(grades)
  const apsMet = !programme.aps || aps >= programme.aps
  const metCount =
    programme.requirements.length - missingSubjects.length + (apsMet ? 1 : 0)
  const totalCount = programme.requirements.length + (programme.aps ? 1 : 0)
  const score = totalCount === 0 ? 1 : metCount / totalCount
  const status =
    missingSubjects.length === 0 && apsMet
      ? "Likely"
      : score >= 0.65
        ? "Close"
        : "Stretch"

  return {
    missingSubjects,
    score,
    status,
  }
}

type ProgrammeMatch = Programme & {
  evaluation: ReturnType<typeof evaluateProgramme>
}

function statusStyles(status: string) {
  if (status === "Likely") {
    return "bg-[#fff1dc] text-[#a14300]"
  }
  if (status === "Close") {
    return "bg-[#f8f1e8] text-[#8a4b12]"
  }
  return "bg-[#f3f4f6] text-[#6b7280]"
}

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

function CtaButton({
  children,
  href,
  className,
  onNavigate,
}: {
  children: string
  href: string
  className?: string
  onNavigate?: () => void
}) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimationComplete(true), 550)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <InteractiveHoverButton
      type="button"
      active={animationComplete}
      onClick={() => {
        onNavigate?.()
        scrollToSection(href)
      }}
      className={cn(
        "h-12 border-[#f26a1b] bg-white px-6 text-base text-[#17120f] shadow-sm transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </InteractiveHoverButton>
  )
}

function GradeButton({
  active,
  grade,
  onClick,
}: {
  active: boolean
  grade: Exclude<Grade, "">
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-14 min-w-14 rounded-2xl px-4 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25",
        active
          ? "bg-[#f26a1b] text-white shadow-[0_8px_22px_rgba(242,106,27,0.25)]"
          : "bg-[#f4f4f1] text-[#6b625c] hover:bg-[#ffe7cf] hover:text-[#b24600]"
      )}
      aria-pressed={active}
    >
      {grade}
    </button>
  )
}

function GradeMatcher({
  onTopMatchChange,
}: {
  onTopMatchChange: (programme: ProgrammeMatch | null) => void
}) {
  const [grades, setGrades] = useState(initialGrades)
  const [subjectIndex, setSubjectIndex] = useState(0)
  const [otherSubject, setOtherSubject] = useState("")
  const [otherQuery, setOtherQuery] = useState("")
  const [matcherComplete, setMatcherComplete] = useState(false)

  const aps = calculateAps(grades)
  const currentSubject = coreSubjects[subjectIndex] ?? coreSubjects[0]
  const inOtherStep = !matcherComplete && subjectIndex >= firstOtherSubjectIndex
  const progress = matcherComplete
    ? 100
    : Math.round((subjectIndex / (coreSubjects.length + 1)) * 100)
  const searchedOtherSubjects = otherSubjects.filter((subject) =>
    subject.toLowerCase().includes(otherQuery.trim().toLowerCase())
  )
  const rankedProgrammes = useMemo(() => {
    return programmes
      .map((programme) => ({
        ...programme,
        evaluation: evaluateProgramme(programme, grades),
      }))
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
  }, [grades])

  useEffect(() => {
    onTopMatchChange(matcherComplete ? rankedProgrammes[0] ?? null : null)
  }, [matcherComplete, onTopMatchChange, rankedProgrammes])

  const chooseGrade = (grade: Exclude<Grade, "">) => {
    if (inOtherStep) {
      if (!otherSubject) {
        return
      }

      setGrades((current) => ({
        ...current,
        [otherSubject]: grade,
      }))
      setOtherSubject("")
      setOtherQuery("")
      return
    }

    setGrades((current) => ({
      ...current,
      [currentSubject]: grade,
    }))
    setSubjectIndex((index) => Math.min(coreSubjects.length, index + 1))
  }

  const skipSubject = () => {
    if (inOtherStep) {
      setOtherSubject("")
      setOtherQuery("")
      return
    }

    setGrades((current) => ({
      ...current,
      [currentSubject]: "",
    }))
    setSubjectIndex((index) => Math.min(coreSubjects.length, index + 1))
  }

  const goBack = () => {
    if (matcherComplete) {
      setMatcherComplete(false)
      setSubjectIndex(matcherSubjects.length - 1)
      return
    }

    if (inOtherStep) {
      setOtherSubject("")
      setOtherQuery("")
    }

    setSubjectIndex((index) => Math.max(0, index - 1))
  }

  const resetMatcher = () => {
    setGrades(initialGrades)
    setSubjectIndex(0)
    setOtherSubject("")
    setOtherQuery("")
    setMatcherComplete(false)
  }

  return (
    <section
      id="matcher"
      className="py-16"
    >
      <div className={cn("space-y-8", !matcherComplete && "mx-auto w-full max-w-5xl")}>
        <BlurFade
          className={cn("max-w-2xl", !matcherComplete && "mx-auto text-center")}
          direction="up"
          inView
          offset={14}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
            Matcher
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#17120f] sm:text-5xl">
            Your grades become a direction.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#6b625c]">
            Enter the subjects you took, skip the ones you did not, then see the
            APS estimate and study paths when you are ready.
          </p>
        </BlurFade>

        <BlurFade
          className={cn(
            matcherComplete
              ? "bg-transparent p-0"
              : "rounded-[2rem] border border-[#eee7df] bg-white p-5 shadow-[0_18px_50px_rgba(37,30,24,0.045)] sm:p-8"
          )}
          direction="up"
          inView
          offset={12}
        >
          {!matcherComplete ? (
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-[#8a7f76]">
                <span>
                  {inOtherStep ? "Step 2 · Other subjects" : "Step 1 · Core subjects"}
                </span>
                <span>
                  {inOtherStep ? "Optional" : `${subjectIndex + 1} of ${coreSubjects.length}`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f4f1ed]">
                <div
                  className="h-full rounded-full bg-[#f26a1b] transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {matcherComplete ? (
            <BlurFade key="matcher-complete" direction="left" offset={16} duration={0.35}>
              <div className="space-y-5">
                <Card className="rounded-[2rem] border-0 bg-[#fff7ed] py-0 text-[#17120f] shadow-none ring-0">
                  <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[260px_1fr] lg:items-center">
                    <div className="rounded-[1.75rem] bg-white p-6 text-center">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a14300]">
                        Estimated APS
                      </p>
                      <div className="mt-3 flex items-end justify-center gap-2">
                        <NumberTicker
                          value={aps}
                          className="text-7xl font-semibold tracking-[-0.06em] text-[#17120f]"
                        />
                        <span className="pb-3 text-sm font-semibold text-[#8a4b12]">
                          pts
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#17120f]">
                        Here is the shape of your options.
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625c]">
                        This estimate uses your best six symbols. It is a guide
                        for narrowing options, not a replacement for official
                        admissions requirements.
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {[
                          [
                            rankedProgrammes.filter(
                              (item) => item.evaluation.status === "Likely"
                            ).length,
                            "likely",
                          ],
                          [
                            rankedProgrammes.filter(
                              (item) => item.evaluation.status === "Close"
                            ).length,
                            "close",
                          ],
                          [programmes.length, "paths"],
                        ].map(([value, label]) => (
                          <div key={label} className="rounded-2xl bg-white px-4 py-3">
                            <NumberTicker
                              value={Number(value)}
                              className="text-2xl font-semibold tracking-normal text-[#17120f]"
                            />
                            <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8a4b12]">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#17120f]">
                        Likely courses
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b625c]">
                        APS is calculated from the best six symbols entered. Use
                        these as a guide, then confirm official requirements.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                        onClick={() => {
                          setMatcherComplete(false)
                          setSubjectIndex(0)
                        }}
                      >
                        Review answers
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                        onClick={resetMatcher}
                      >
                        Start over
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {rankedProgrammes.slice(0, 6).map((programme) => (
                      <Card
                        key={`${programme.institution}-${programme.title}`}
                        className="min-w-[260px] flex-1 basis-[18rem] rounded-[1.75rem] border-0 bg-[#faf8f5] py-4 shadow-none ring-0"
                      >
                        <CardHeader className="gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "h-6 rounded-full px-3 font-semibold",
                                statusStyles(programme.evaluation.status)
                              )}
                            >
                              {programme.evaluation.status}
                            </Badge>
                            <span className="text-xs font-medium text-[#9d928a]">
                              {programme.duration}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold tracking-[-0.02em] text-[#17120f]">
                              {programme.title}
                            </CardTitle>
                            <CardDescription className="text-[#756a62]">
                              {programme.institution}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm leading-6 text-[#6b625c]">
                            {programme.note}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {programme.requirements.map((requirement) => (
                              <span
                                key={minGradeLabel(requirement)}
                                className="rounded-full bg-[#f7f4ef] px-3 py-1 text-xs font-medium text-[#6b625c]"
                              >
                                {minGradeLabel(requirement)}
                              </span>
                            ))}
                            {programme.aps ? (
                              <span className="rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-semibold text-[#a14300]">
                                APS {programme.aps}+
                              </span>
                            ) : null}
                          </div>
                          {programme.evaluation.missingSubjects.length > 0 ? (
                            <p className="text-xs text-[#9d928a]">
                              Check{" "}
                              {programme.evaluation.missingSubjects
                                .map(minGradeLabel)
                                .join(", ")}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1.5 text-xs font-medium text-[#c24f00]">
                              <Check className="size-3.5" />
                              Requirements look aligned. Confirm before applying.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </BlurFade>
          ) : inOtherStep ? (
            <BlurFade key="other-subjects" direction="left" offset={16} duration={0.35}>
              <div className="rounded-[1.75rem] bg-[#faf8f5] p-6 text-center sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f26a1b]">
                  Optional subjects
                </p>
                <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#17120f]">
                  Add another subject?
                </h3>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-[#6b625c]">
                  Search for an extra subject you took. If it is not listed, you
                  can skip straight to the APS score.
                </p>

                <div className="relative mx-auto mt-6 max-w-2xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9d928a]" />
                  <Input
                    value={otherQuery}
                    onChange={(event) => {
                      setOtherQuery(event.target.value)
                      setOtherSubject("")
                    }}
                    placeholder="Search Accounting, Geography, Agriculture..."
                    className="h-12 rounded-full border-0 bg-white pl-11 text-base shadow-none focus-visible:ring-orange-500/30"
                  />
                </div>

                {otherQuery.trim() ? (
                  searchedOtherSubjects.length > 0 ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {searchedOtherSubjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => setOtherSubject(subject)}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25",
                            otherSubject === subject
                              ? "bg-[#17120f] text-white"
                              : "bg-white text-[#6b625c] hover:bg-[#fff1dc] hover:text-[#17120f]"
                          )}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mx-auto mt-4 max-w-xl rounded-3xl bg-white p-4">
                      <p className="text-sm font-medium text-[#6b625c]">
                        That subject is not in this version of Leseli yet.
                      </p>
                      <Button
                        type="button"
                        className="mt-4 h-11 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f]"
                        onClick={() => setMatcherComplete(true)}
                      >
                        Show APS score
                      </Button>
                    </div>
                  )
                ) : null}

                {otherSubject ? (
                  <div className="mx-auto mt-7 max-w-3xl rounded-3xl bg-white p-4">
                    <p className="text-sm font-semibold text-[#221a15]">
                      {otherSubject}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {gradeOptions.map((grade) => (
                        <GradeButton
                          key={grade}
                          grade={grade}
                          active={grades[otherSubject] === grade}
                          onClick={() => chooseGrade(grade)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                    onClick={goBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="h-11 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f]"
                    onClick={() => setMatcherComplete(true)}
                  >
                    Show APS score
                  </Button>
                </div>
              </div>
            </BlurFade>
          ) : (
            <BlurFade
              key={currentSubject}
              direction="left"
              offset={16}
              duration={0.35}
            >
              <div className="rounded-[1.75rem] bg-[#faf8f5] p-6 text-center sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f26a1b]">
                  Core subject
                </p>
                <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#17120f]">
                  {currentSubject}
                </h3>
                <p className="mt-3 leading-7 text-[#6b625c]">
                  What symbol did you get for this subject?
                </p>

                <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-6">
                  {gradeOptions.map((grade) => (
                    <GradeButton
                      key={grade}
                      grade={grade}
                      active={grades[currentSubject] === grade}
                      onClick={() => chooseGrade(grade)}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={subjectIndex === 0}
                      className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                      onClick={goBack}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-11 rounded-full bg-white px-5 hover:bg-[#efe8df]"
                      onClick={skipSubject}
                    >
                      Skip subject
                    </Button>
                  </div>
                </div>
              </div>
            </BlurFade>
          )}
        </BlurFade>
      </div>
    </section>
  )
}

function FloatingNav() {
  const [navMode, setNavMode] = useState<"expanded" | "shrinking" | "hamburger">(
    "expanded"
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const shrinkTimer = useRef<number | null>(null)
  const navModeRef = useRef<"expanded" | "shrinking" | "hamburger">("expanded")

  const setNavModeState = useCallback(
    (mode: "expanded" | "shrinking" | "hamburger") => {
      navModeRef.current = mode
      setNavMode(mode)
    },
    []
  )

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const clearShrinkTimer = () => {
      if (shrinkTimer.current) {
        window.clearTimeout(shrinkTimer.current)
        shrinkTimer.current = null
      }
    }

    const expandNav = () => {
      clearShrinkTimer()
      setNavModeState("expanded")
      setMenuOpen(false)
    }

    const collapseNav = () => {
      if (navModeRef.current !== "expanded") {
        return
      }

      clearShrinkTimer()
      setMenuOpen(false)
      setNavModeState("shrinking")
      shrinkTimer.current = window.setTimeout(() => {
        setNavModeState("hamburger")
        shrinkTimer.current = null
      }, 320)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      const distance = currentY - lastScrollY.current

      if (currentY < 40) {
        expandNav()
      } else if (distance > 8) {
        collapseNav()
      } else if (distance < -8) {
        expandNav()
      }

      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      clearShrinkTimer()
      window.removeEventListener("scroll", onScroll)
    }
  }, [setNavModeState])

  const flipped = navMode === "hamburger" && !menuOpen
  const contentVisible = navMode === "expanded"
  const openExpandedNav = () => {
    if (shrinkTimer.current) {
      window.clearTimeout(shrinkTimer.current)
      shrinkTimer.current = null
    }

    setNavModeState("expanded")
    setMenuOpen(true)
  }

  return (
    <header
      className={cn(
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 [perspective:1200px] transition-[width,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        navMode === "hamburger" || navMode === "shrinking"
          ? "h-12 w-12"
          : menuOpen
            ? "h-[252px] w-[calc(100%-1.5rem)] max-w-3xl md:h-[60px] md:w-[500px]"
            : "h-[60px] w-[calc(100%-1.5rem)] max-w-3xl md:w-[500px]"
      )}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[#eee7df] bg-white/95 px-2 py-2 shadow-[0_18px_50px_rgba(23,18,15,0.10)] backdrop-blur-xl [backface-visibility:hidden] sm:px-2">
          <div
            className={cn(
              "flex h-full items-center justify-around gap-2 transition-all duration-300 ease-out",
              contentVisible
                ? "translate-x-0 opacity-100 delay-300"
                : "-translate-x-4 opacity-0"
            )}
          >
            <div className="flex gap-2">
            <a
              href="#"
              className="whitespace-nowrap text-base font-semibold tracking-[-0.03em] text-[#17120f] sm:text-lg"
              aria-label="Leseli home"
            >
              leseli logo
            </a>
            <Separator
              orientation="vertical"
              className="hidden h-10 self-center bg-[#e7ded5] md:block"
            />
            </div>
            <nav className="hidden items-center gap-3 text-sm font-medium text-[#6f665f] md:flex">
              <a className="transition hover:text-[#17120f]" href="#matcher">
                Matcher
              </a>
              <a className="transition hover:text-[#17120f]" href="#institutions">
                Institutions
              </a>
              <a className="transition hover:text-[#17120f]" href="#resources">
                Apply
              </a>
            </nav>
            <Button
              type="button"
              onClick={() => scrollToSection("#matcher")}
              className="hidden h-10 min-w-32 rounded-full bg-[#f26a1b] px-5 font-semibold text-white hover:bg-[#d9580f] sm:inline-flex"
            >
              Start
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex size-10 items-center justify-center rounded-full bg-[#f6f3ef] text-[#17120f] transition hover:bg-[#eee7df] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25 md:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
          <div
            className={cn(
              "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
              menuOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <nav className="flex flex-col gap-2 pt-4 text-sm font-semibold text-[#17120f]">
                {[
                  ["Matcher", "#matcher"],
                  ["Institutions", "#institutions"],
                  ["Apply", "#resources"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl bg-[#f8f6f2] px-4 py-3 transition hover:bg-[#fff1dc]"
                  >
                    {label}
                  </a>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    scrollToSection("#matcher")
                  }}
                  className="mt-1 h-11 rounded-full bg-[#f26a1b] font-semibold text-white hover:bg-[#d9580f] sm:hidden"
                >
                  Start
                </Button>
              </nav>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={openExpandedNav}
          className="absolute inset-0 flex items-center justify-center rounded-full border border-[#eee7df] bg-white text-[#17120f] shadow-[0_12px_36px_rgba(23,18,15,0.12)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-500/25 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  )
}

function ApplySection({ topMatch }: { topMatch: ProgrammeMatch | null }) {
  const checklist = topMatch
    ? [
        [
          "Verify the entry rule",
          [
            topMatch.aps ? `APS ${topMatch.aps}+` : "Confirm the APS rule",
            ...topMatch.requirements.map(minGradeLabel),
          ].join(" · "),
        ],
        [
          "Compare the real fit",
          `Check fees, campus, accommodation, and support at ${topMatch.institution}.`,
        ],
        [
          "Prepare the application",
          "Gather your results slip, ID copy, application fee proof, and any programme forms.",
        ],
      ]
    : [
        [
          "Run the matcher",
          "Enter your symbols first so Leseli can turn this into a programme-specific checklist.",
        ],
        [
          "Compare the top options",
          "Once results appear, look beyond eligibility: fees, location, support, and duration matter.",
        ],
        [
          "Prepare the essentials",
          "Keep your results slip, ID copy, payment proof, and application forms close.",
        ],
      ]

  return (
    <Card className="rounded-[2rem] border-0 bg-[#faf8f5] py-7 shadow-none ring-0">
      <CardHeader>
        {topMatch ? (
          <div className="mb-2 rounded-3xl bg-white p-5">
            <Badge
              variant="secondary"
              className={cn(
                "mb-4 h-6 rounded-full px-3 font-semibold",
                statusStyles(topMatch.evaluation.status)
              )}
            >
              Top match
            </Badge>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-[#17120f]">
              Before you apply to {topMatch.title}
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-7 text-[#6b625c]">
              {topMatch.institution} · {topMatch.duration}
            </CardDescription>
          </div>
        ) : (
          <>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-[#17120f]">
              Your next steps will appear here.
            </CardTitle>
            <CardDescription className="text-base leading-7 text-[#6b625c]">
              Finish the matcher and Leseli will turn the top result into a
              focused apply checklist.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {checklist.map(([title, body], index) => (
            <div key={title} className="flex gap-4 rounded-3xl bg-white p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff1dc] text-sm font-semibold text-[#c24f00]">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-[#221a15]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b625c]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function LeseliApp() {
  const [topMatch, setTopMatch] = useState<ProgrammeMatch | null>(null)

  return (
    <main className="min-h-screen bg-white text-[#17120f]">
      <FloatingNav />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <section className="grid min-h-screen gap-12 pb-14 pt-32 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-28">
          <BlurFade
            className="max-w-3xl space-y-8"
            direction="up"
            offset={18}
            duration={0.55}
          >
            <div className="space-y-5">
              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#17120f] sm:text-7xl">
                Find the path your grades can unlock.
              </h1>
              <p className="max-w-xl text-xl leading-8 text-[#6b625c]">
                Leseli helps students move from LGCSE results to realistic study
                options across Lesotho.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CtaButton href="#matcher">
                Check my options
              </CtaButton>
              <Button
                type="button"
                onClick={() => scrollToSection("#institutions")}
                variant="secondary"
                className="h-12 rounded-full bg-[#f4f1ed] px-6 text-base font-semibold hover:bg-[#ebe5de]"
              >
                Browse institutions
              </Button>
            </div>
          </BlurFade>

          <BlurFade
            className="relative"
            direction="left"
            offset={18}
            delay={0.12}
            duration={0.55}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eee7df] bg-white shadow-[0_30px_100px_rgba(37,30,24,0.10)]">
              <div className="relative aspect-[16/11]">
                <Image
                  src="/leseli-students.png"
                  alt="Students using phones together on campus"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 44rem, 100vw"
                />
              </div>
            </div>
          </BlurFade>
        </section>

        <GradeMatcher onTopMatchChange={setTopMatch} />

        <section id="institutions" className="py-16">
          <BlurFade
            className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
            direction="up"
            inView
            offset={16}
          >
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
                Institutions
              </p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Keep the landscape visible.
              </h2>
            </div>
            <p className="max-w-lg text-lg leading-8 text-[#6b625c]">
              A simple institution layer helps students compare before they
              commit attention, fees, and applications.
            </p>
          </BlurFade>
          <BlurFade
            className="relative overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            direction="up"
            inView
            offset={14}
          >
            <div className="space-y-4">
              {institutionRows.map((row, rowIndex) => (
                <Marquee
                  key={row.join("-")}
                  pauseOnHover
                  reverse={rowIndex === 1}
                  className={cn(
                    "[--duration:32s]",
                    rowIndex === 1 && "[--duration:38s]"
                  )}
                >
                  {row.map((institution) => (
                    <div
                      key={institution}
                      className="mx-2 flex h-16 min-w-56 items-center justify-between rounded-3xl bg-[#faf8f5] px-5"
                    >
                      <span className="font-semibold text-[#221a15]">
                        {institution}
                      </span>
                      <Building2 className="size-4 text-[#f26a1b]" />
                    </div>
                  ))}
                </Marquee>
              ))}
            </div>
          </BlurFade>
        </section>

        <section id="resources" className="grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <BlurFade direction="up" inView offset={16}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f26a1b]">
              Apply
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Make the next move obvious.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6b625c]">
              The best result page does not just say yes or no. It tells a
              student what to check, compare, and prepare.
            </p>
          </BlurFade>

          <BlurFade direction="left" inView offset={18}>
            <ApplySection topMatch={topMatch} />
          </BlurFade>
        </section>

        <footer className="border-t border-[#f0ebe5] py-12">
          <div className="grid gap-10 text-sm md:grid-cols-[1.2fr_repeat(3,1fr)]">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-[#17120f]">
                leseli logo
              </p>
              <p className="mt-3 max-w-xs leading-6 text-[#8a7f76]">
                Study choices, made clearer for students comparing options in
                Lesotho.
              </p>
            </div>
            {[
              [
                "Product",
                [
                  ["Matcher", "#matcher"],
                  ["Institutions", "#institutions"],
                  ["Apply checklist", "#resources"],
                ],
              ],
              [
                "Support",
                [
                  ["Contact", "mailto:hello@leseli.app"],
                  ["Help centre", "#"],
                  ["Feedback", "mailto:hello@leseli.app"],
                ],
              ],
              [
                "Legal",
                [
                  ["Privacy policy", "#"],
                  ["Terms", "#"],
                  ["Accessibility", "#"],
                  ["Data policy", "#"],
                ],
              ],
            ].map(([title, links]) => (
              <div key={title as string}>
                <p className="font-semibold text-[#17120f]">{title as string}</p>
                <div className="mt-4 flex flex-col gap-3 text-[#8a7f76]">
                  {(links as string[][]).map(([label, href]) => (
                    <a
                      key={label}
                      className="transition hover:text-[#17120f]"
                      href={href}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 text-xs font-medium text-[#9d928a] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Leseli. All rights reserved.</p>
            <p>Guidance only. Always confirm official entry requirements.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
