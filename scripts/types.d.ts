export type Theme = 'light' | 'dark';

export type Config = {
    lecture: string,
    directory: string,
    theme: Theme,
    authors: string[]
}

export type Assignment = {
    name: string,
    id: string,
    exercises: string[],
    archive?: string,
    importTime?: number
}

export type Exercise = {
    name: string,
    description: string,
    page: string,
    entry: string,
    include?: string[],
    exclude?: string[]
}

export type Submission = {
    id: string,
    students: string[]
}

export type Assignments = Assignment[];

export type ImportCheckResult = {
    shouldImport: boolean,
    index: number,
    newConfig: Assignment | Submission
}

export type LoadAssignmentsResult = {
    assignments: Assignments,
    assignmentsPath: string
}

export type ArgA = {
    authors: string[]
}

export type ArgC = {
    config: string
}

export type ArgD = {
    directory: string
}

export type ArgF = {
    force: boolean,
}

export type ArgI = {
    input: string,
}

export type ArgL = {
    lecture: string
}

export type ArgM = {
    mode: 'assignment' | 'submission'
}

export type ArgO = {
    output: string,
}

export type ArgR = {
    reset: boolean
}

export type ArgT = {
    theme: Theme
}

export type ArgY = {
    assumeYes: boolean,
}

export type ArgDY = ArgD & ArgY
export type ArgFY = ArgF & ArgY
export type ArgMY = ArgM & ArgY

export type InitOptions = ArgA & ArgC & ArgD & ArgF & ArgL & ArgT & ArgY
export type ImportOptions = Config & ArgI & ArgM & ArgR
export type ImportAssignmentOptions = ImportOptions & ArgY
export type ExportOptions = Config & ArgI & ArgM & ArgY
