export default class DataEntry {
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

    // check if two data entires are equal, assume the same keys
    dataEntriesEqual(dataEntry1: any, dataEntry2: any): boolean {
        // keys are the same
        let keys = Object.keys(dataEntry1);
        let decision  = true;

        for (let key of keys) {
            if (dataEntry1[key] !== dataEntry2[key]) return false;
        }
        return true;
    }
}