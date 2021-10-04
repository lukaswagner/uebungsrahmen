export type Theme = 'light' | 'dark';

export type Config = {
    lecture: string,
    exerciseDir: string,
    theme: Theme
}

export type Assignment = {
    name: string,
    id: string,
    exercises: string[],
    archive?: string,
    importTime?: number
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

export type ArgT = {
    'color-theme': Theme
}

export type ArgY = {
    assumeYes: boolean,
}

export type ArgDY = ArgD & ArgY
export type ArgMY = ArgM & ArgY

export type InitOptions = ArgC & ArgD & ArgF & ArgL & ArgT & ArgY
export type ImportOptions = ArgC & ArgI & ArgM
export type ImportAssignmentOptions = ImportOptions & ArgY
