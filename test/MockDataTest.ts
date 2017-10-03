import {expect} from 'chai';
import FilterEQ from "../src/controller/QueryController/Filters/FilterComparison/FilterEQ";
import FilterGT from "../src/controller/QueryController/Filters/FilterComparison/FilterGT";
import FilterLT from "../src/controller/QueryController/Filters/FilterComparison/FilterLT";
import FilterOR from "../src/controller/QueryController/Filters/FilterLogic/FilterOR";
import FilterAND from "../src/controller/QueryController/Filters/FilterLogic/FilterAND";

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

describe("Simple filter tests, i.e., at most 1 and/or", function () {


    var data = new MockData();
    var filter =  {courses_avg: 100};
    var filter2 = {courses_avg: 70};
    var filter3 = {courses_avg: 70};
    var filter4 = [{EQ: {courses_avg: 100}}, {LT: {courses_avg: 70}}];
    var filter5 = [{EQ: {courses_audit: 5}}, {OR: [{EQ: {courses_avg: 90}}, {EQ: {courses_pass: 100}}]}];
    var filter6 = [{EQ: {courses_audit: 5}}, {EQ: {courses_pass: 20}}, {EQ: {courses_fail: 0}}];
    var filter7 = [{GT: {courses_avg: 90}}, {EQ: {courses_fail: 5}}];
    var filter8 = [{LT: {courses_audit: 50}}, {OR: [{GT: {courses_fail: 10}}, {EQ: {courses_pass: 100}}]}];



    var filterEQ: FilterEQ;
    var filterGT: FilterGT;
    var filterLT: FilterLT;
    var filterOR: FilterOR;
    var filterORNested: FilterOR;
    var filterORMultiple: FilterOR;
    var filterAND: FilterAND;
    var filterANDOR1: FilterAND

    beforeEach(function () {
        filterEQ = new FilterEQ(filter, data.getData())
        filterGT = new FilterGT(filter2, data.getData())
        filterLT = new FilterLT(filter3, data.getData())
        filterOR = new FilterOR(filter4, data.getData())
        filterORNested = new FilterOR(filter5, data.getData())
        filterORMultiple = new FilterOR(filter6, data.getData())
        filterAND = new FilterAND(filter7, data.getData())
        filterANDOR1 = new FilterAND(filter8, data.getData())
    });

    afterEach(function () {
        filterEQ = null;
        filterGT = null;
        filterLT = null;
        filterOR = null;
        filterORNested = null;
        filterORMultiple = null;
        filterAND = null;
        filterANDOR1 = null;
    });


    it("Test FilterEQ on course_avg", function () {
        let queryResponse = filterEQ.applyFilter();
       // expect(queryResponse[0].courses_instructor).to.deep.equal("Steve");
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Test FilterGT on course_avg", function () {
        let queryResponse = filterGT.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterLT on course_avg", function () {
        let queryResponse = filterLT.applyFilter();
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Test FilterOR on course_avg", function () {
        let queryResponse:any[] = filterOR.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Test FilterOR with 3 choices, other attributes", function () {
        let queryResponse:any[] = filterORMultiple.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterOR nested", function () {
        let queryResponse:any[] = filterORNested.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Data entries equal", function () {
        let a: DataEntry = new DataEntry("math", "101", 60, "Bob", 100, 10, 5, "A1");
        let b: DataEntry = new DataEntry("math", "101", 60, "Bob", 100, 10, 5, "A1");
        let c: DataEntry = new DataEntry("math", "101", 60, "Bill", 10, 10, 5, "A1");
        expect(filterOR.dataEntriesEqual(a, b)).to.deep.equal(true);
        expect(filterOR.dataEntriesEqual(a, c)).to.deep.equal(false);
    });

    it("Remove duplicates", function () {
        data.getData().push(new DataEntry("math", "101", 60, "Bob", 100, 10, 5, "A1"));
        data.getData().push(new DataEntry("educ", "202", 90, "Alice", 20, 30, 50, "C5"));
        expect(filterOR.removeDuplicates(data.getData()).length).to.deep.equal(5);
    });

    it("Filter AND", function () {
        let queryResponse = filterAND.applyFilter();
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Filter AND and OR: AND(..., OR(..., ....))", function () {
        let queryResponse = filterANDOR1.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    });
