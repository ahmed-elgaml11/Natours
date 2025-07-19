// unused file for ABAC,  just for learning


type Project = {
    department: string,
    team: string[],
    accessLevel: number

}
type User = {
    id: string
    role: string
    department: string,
    accessLevel: number
}

export const canViewProject = (user: User, project: Project) => {
    return(
        user.role === 'admin' || 
        user.department === project.department ||
        (user.accessLevel >= project.accessLevel && project.team.includes(user.id))
    )
}

export const canUpdateProject = (user: User, project: Project) => {
    return(
        user.role === 'admin' || 
        (user.role === 'manager' && user.department === project.department)
    )
}