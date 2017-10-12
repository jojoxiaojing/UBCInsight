import {expect} from 'chai';
import FilterEQ from "../src/controller/QueryController/Filters/FilterComparison/FilterEQ";
import FilterGT from "../src/controller/QueryController/Filters/FilterComparison/FilterGT";
import FilterLT from "../src/controller/QueryController/Filters/FilterComparison/FilterLT";
import FilterOR from "../src/controller/QueryController/Filters/FilterLogic/FilterOR";
import FilterAND from "../src/controller/QueryController/Filters/FilterLogic/FilterAND";
import FilterIS from "../src/controller/QueryController/Filters/FilterComparison/FilterIS";
import FilterNOT from "../src/controller/QueryController/Filters/FilterLogic/FilterNOT";

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
        this.data.push(new DataEntry("math", "101", 60, "Bob",    100,  10,    5, "A1"));
        this.data.push(new DataEntry("math", "102", 70, "Bob",    50,   50,    20, "B2"));
        this.data.push(new DataEntry("math", "400", 80, "Steve",  100,   0,    10, "B3"));
        this.data.push(new DataEntry("educ", "202", 90, "Alice",  20,    30,   50, "C5"));
        this.data.push(new DataEntry("educ", "303", 100, "Steve", 70,     5,   20, "D0"));
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

describe("Testing Logic Operators", function () {


    var data = new MockData();
    var filter =  {courses_avg: 100};
    var filter2 = {courses_avg: 70};
    var filter3 = {courses_avg: 70};
    var filter4 = [{EQ: {courses_avg: 100}}, {LT: {courses_avg: 70}}];
    var filter5 = [{EQ: {courses_audit: 5}}, {OR: [{EQ: {courses_avg: 90}}, {EQ: {courses_pass: 100}}]}];
    var filter6 = [{EQ: {courses_audit: 5}}, {EQ: {courses_pass: 20}}, {EQ: {courses_fail: 0}}];
    var filter7 = [{GT: {courses_avg: 90}}, {EQ: {courses_fail: 5}}];
    var filter8 = [{LT: {courses_audit: 50}}, {OR: [{GT: {courses_fail: 10}}, {EQ: {courses_pass: 100}}]}];
    var filter9 = [{LT: {courses_audit: 20}}, {AND: [{EQ: {courses_avg: 90}}, {EQ: {courses_audit: 50}}]}];
    var filter10 = {courses_instructor: "Bob"};
    var filter11 = [{IS: {courses_instructor: "Bob"}}, {AND: [{EQ: {courses_avg: 90}}, {EQ: {courses_audit: 50}}]}];
    var filter12 = {IS: {courses_instructor: "Bob"}};
    var filter13 = {IS: {courses_instructor: "*ob"}};
    var filter14 = {IS: {courses_instructor: "Alic*"}};
    var filter15 = {IS: {courses_instructor: "*teve"}};
    var filter16 =  {OR: [{IS: {courses_instructor: "Bob"}}, {AND: [{EQ: {courses_avg: 80}}, {EQ: {courses_audit: 10}}]}]};
    var filter17 = {NOT: {AND: [{GT: {courses_avg: 0}}, {LT: {courses_avg: 80}}]}}
    var filter18 = {NOT: {NOT: {NOT: {AND: [{GT: {courses_avg: 0}}, {LT: {courses_avg: 80}}]}}}}
    var filter19 = [{NOT: {NOT: {AND: [{GT: {courses_avg: 0}}, {LT: {courses_avg: 80}}]}}}, {NOT: {NOT: {AND: [{GT: {courses_avg: 0}}, {LT: {courses_avg: 80}}]}}}]
    var filter20 = [{AND: [{AND: [{EQ: {courses_avg: 60}}, {IS: {courses_instructor: "Bob"}}]}, {IS: {courses_dept: "math"}}]}, {EQ: {courses_audit: 5}}]


    var filterEQ: FilterEQ;
    var filterGT: FilterGT;
    var filterLT: FilterLT;
    var filterOR: FilterOR;
    var filterORNested: FilterOR;
    var filterORMultiple: FilterOR;
    var filterAND: FilterAND;
    var filterANDOR1: FilterAND;
    var filterANDOR2: FilterOR;
    var filterIS: FilterIS;
    var filterANDORIS: FilterOR;
    var filterNOTIS: FilterNOT;
    var filterNOTNESTED: FilterNOT;
    var filterANDMultiple: FilterAND;
    var filterNOTMultiple: FilterNOT;
    var filterNOTWild1: FilterNOT;
    var filterNOTWildL: FilterNOT;
    var filterNOTWild1L: FilterNOT;
    var filterNOTNOT: FilterNOT;
    var filterNOTNOTNOTNOT: FilterNOT;
    var filterANDNOTNOT: FilterAND;
    var filter4ANDNESTED: FilterAND;



    beforeEach(function () {
        var data = new MockData();
        filterEQ = new FilterEQ(filter, data.getData());
        filterGT = new FilterGT(filter2, data.getData());
        filterLT = new FilterLT(filter3, data.getData());
        filterOR = new FilterOR(filter4, data.getData());
        filterORNested = new FilterOR(filter5, data.getData());
        filterORMultiple = new FilterOR(filter6, data.getData());
        filterAND = new FilterAND(filter7, data.getData());
        filterANDOR1 = new FilterAND(filter8, data.getData());
        filterANDOR2 = new FilterOR(filter9, data.getData());
        filterIS = new FilterIS(filter10, data.getData());
        filterANDORIS = new FilterOR(filter11, data.getData());
        filterNOTIS = new FilterNOT(filter12, data.getData());
        filterNOTNESTED = new FilterNOT(filter16, data.getData());
        filterANDMultiple = new FilterAND(filter6, data.getData());
        filterNOTMultiple = new FilterNOT(filter6, data.getData());
        filterNOTWild1 = new FilterNOT(filter13, data.getData());
        filterNOTWildL = new FilterNOT(filter14, data.getData());
        filterNOTWild1L = new FilterNOT(filter15, data.getData());
        filterNOTNOT = new FilterNOT(filter17, data.getData());
        filterNOTNOTNOTNOT = new FilterNOT(filter18, data.getData());
        filterANDNOTNOT = new FilterAND(filter19, data.getData());
        filter4ANDNESTED = new FilterAND(filter20, data.getData());
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
        filterANDOR2 = null;
        filterIS = null;
        filterANDORIS = null;
        filterNOTIS = null;
        filterNOTNESTED = null;
        filterANDMultiple = null;
        filterNOTMultiple = null;
        filterNOTWild1 = null;
        filterNOTWildL = null;
        filterNOTWild1L = null;
        filterNOTNOT = null;
        filterNOTNOTNOTNOT = null;
        filterANDNOTNOT = null;
        filter4ANDNESTED = null;
    });


   it("Test FilterEQ on course_avg", function () {
        expect(filterEQ.checkQueryValid()).to.deep.equal(true);
        let queryResponse = filterEQ.applyFilter();
       // expect(queryResponse[0].courses_instructor).to.deep.equal("Steve");
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Test FilterGT on course_avg", function () {
        expect(filterGT.checkQueryValid()).to.deep.equal(true);
        let queryResponse = filterGT.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterLT on course_avg", function () {
        expect(filterLT.checkQueryValid()).to.deep.equal(true);
        let queryResponse = filterLT.applyFilter();
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Test FilterOR on course_avg", function () {
        expect(filterOR.checkQueryValid()).to.deep.equal(true)
        let queryResponse:any[] = filterOR.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Test FilterOR with 3 choices, other attributes", function () {
        expect(filterORMultiple.checkQueryValid()).to.deep.equal(true)
        let queryResponse:any[] = filterORMultiple.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterOR nested", function () {
        expect(filterORNested.checkQueryValid()).to.deep.equal(true)
        let queryResponse:any[] = filterORNested.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Filter AND", function () {
        expect(filterAND.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterAND.applyFilter();
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Filter AND and OR: AND(..., OR(..., ....))", function () {
        expect(filterANDOR1.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterANDOR1.applyFilter();
        //console.log(queryResponse)
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Filter AND and OR:  OR(..., AND(..., ....))", function () {
        expect(filterANDOR2.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterANDOR2.applyFilter();
        //console.log(queryResponse)
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Filter AND and OR:  OR(..., AND(..., ....)), with IS", function () {
        expect(filterANDORIS.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterANDORIS.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });


    it("Filter IS", function () {
        expect(filterIS.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterIS.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Filter NOT IS", function () {
        expect(filterNOTIS.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTIS.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Filter NOT nested", function () {
        expect(filterNOTNESTED.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTNESTED.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Filter NOT multiple", function () {
        expect(filterNOTMultiple.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTMultiple.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Filter AND multiple", function () {
        expect(filterANDMultiple.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterANDMultiple.applyFilter();
        expect(queryResponse.length).to.deep.equal(0);
    });

    it("Test FilterNOT IS, * at index 0", function () {
        expect(filterNOTWild1.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTWild1.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterNOT IS, * at index length-1", function () {
        expect(filterNOTWildL.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTWildL.applyFilter();
        expect(queryResponse.length).to.deep.equal(4);
    });

    it("Test FilterNOT IS, * at both index 0 and length-1", function () {
        expect(filterNOTWild1L.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTWild1L.applyFilter();
        expect(queryResponse.length).to.deep.equal(3);
    });

    it("Test FilterNOT NOT, double negation", function () {
        expect(filterNOTNOT.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTNOT.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Test FilterNOT NOT NOT NOT NOT, quadruple negation", function () {
        expect(filterNOTNOTNOTNOT.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterNOTNOTNOTNOT.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    it("Test FilterAND: 4 ANDs nested", function () {
        let m = filter4ANDNESTED.checkQueryValid();

        expect( m).to.deep.equal(true)
        let queryResponse =  filter4ANDNESTED.applyFilter();
        expect(queryResponse.length).to.deep.equal(1);
    });

    it("Test FilterAND with two double negations", function () {
        expect(filterANDNOTNOT.checkQueryValid()).to.deep.equal(true)
        let queryResponse = filterANDNOTNOT.applyFilter();
        expect(queryResponse.length).to.deep.equal(2);
    });

    });
