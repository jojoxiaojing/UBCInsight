class DataEntry {
    courses_dept: string;
    courses_id: string;
    courses_avg: number;
    courses_instructor: string;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;
    courses_uuid: string;

    constructor(crs_dept: string, crs_id: string, crs_avg: number, crs_inst: string,
                crs_ps: number, crs_fl: number, crs_aud: number, crs_uuid: string) {
        this.courses_dept = crs_dept;
        this.courses_id = crs_id;
        this.courses_avg = crs_avg;
        this.courses_instructor = crs_inst;
        this.courses_pass = crs_ps;
        this.courses_fail = crs_fl;
        this.courses_audit = crs_aud;
        this.courses_uuid = crs_uuid;
    }
}

export default class MockData {
    data: DataEntry[]=[];

    constructor() {
        this.data.push(new DataEntry("math", "101", 60, "Bob", 100, 10, 5, "A1"));
        this.data.push(new DataEntry("math", "102", 70, "Bob", 50, 50, 20, "B2"));
        this.data.push(new DataEntry("math", "400", 80, "Steve", 100, 0, 10, "B3"));
        this.data.push(new DataEntry("educ", "202", 90, "Alice", 20, 30, 50, "C5"));
        this.data.push(new DataEntry("educ", "303", 100, "Steve", 70, 5, 20, "D0"));
    }

    getData(): DataEntry[] {
        return this.data;
    }

/*    // get value of the entry field
    getDataValue(entry: DataEntry, field: string): string {
        if (field === "courses_dept") return entry.courses_dept;
        if (field === "course_audit") return entry.courses_audit.toString();
        if (field === "courses_avg") return entry.courses_dept;
        if (field === "courses_instructor") return entry.courses_instructor;
        if (field === "courses_pass") return entry.courses_pass.toString();
        if (field === "courses_fail") return entry.courses_fail.toString();
        if (field === "courses_audit") return entry.courses_audit.toString();
        if (field === "courses_uuid") return entry.courses_uuid.toString();
    }*/
}