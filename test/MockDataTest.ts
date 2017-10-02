import {expect} from 'chai';
import QueryBody from "../src/controller/QueryController/QueryBody";
import MockData from "./MockData";
import FilterEQ from "../src/controller/QueryController/Filters/FilterComparison/FilterEQ";
import FilterGT from "../src/controller/QueryController/Filters/FilterComparison/FilterGT";
import FilterLT from "../src/controller/QueryController/Filters/FilterComparison/FilterLT";
import FilterOR from "../src/controller/QueryController/Filters/FilterLogic/FilterOR";

describe("Simple filter tests, i.e., at most 1 and/or", function () {


    var data = new MockData();
    var filter =  {courses_avg: 100};
    var filter2 = {courses_avg: 70};
    var filter3 = {courses_avg: 70};
    var filter4 = [{EQ: {courses_avg: 100}}, {LT: {courses_avg: 70}}];

    var filterEQ: FilterEQ;
    var filterGT: FilterGT;
    var filterLT: FilterLT;
    var filterOR: FilterOR;

    beforeEach(function () {
        filterEQ = new FilterEQ(filter, data.getData())
        filterGT = new FilterGT(filter2, data.getData())
        filterLT = new FilterLT(filter3, data.getData())
        filterOR = new FilterOR(filter4, data.getData())
    });

    afterEach(function () {
        filterEQ = null;
        filterGT = null;
        filterLT = null;
        filterOR = null;
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
});
