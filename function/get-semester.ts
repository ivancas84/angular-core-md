
export function getSemester(d?: Date) {
    d = d || new Date();
    return (d.getMonth() < 6) ? 1 : 2
}