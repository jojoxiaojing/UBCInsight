import {expect} from 'chai';
import QueryBody from "../src/controller/QueryController/QueryBody";
import MockData from "./MockData";
import FilterEQ from "../src/controller/QueryController/Filters/FilterComparison/FilterEQ";
import FilterGT from "../src/controller/QueryController/Filters/FilterComparison/FilterGT";
import FilterLT from "../src/controller/QueryController/Filters/FilterComparison/FilterLT";

describe("FilterEQ", function () {


    var data = new MockData();
    var filter =  {EQ: {courses_avg: 100}};
    var filter2 = {GT: {courses_avg: 70}};
    var filter3 = {LT: {courses_avg: 70}};

    var filterEQ: FilterEQ;
    var filterGT: FilterGT;
    var filterLT: FilterLT;

    beforeEach(function () {
        filterEQ = new FilterEQ(filter, data.getData())
        filterGT = new FilterGT(filter2, data.getData())
        filterLT = new FilterLT(filter3, data.getData())
    });

    afterEach(function () {
        filterEQ = null;
        filterGT = null;
        filterLT = null;
    });


    it("Test FilterEQ on course_avg", function () {
        let queryResponse = filterEQ.applyFilter();
        expect(queryResponse[0].courses_instructor).to.deep.equal("Steve");
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
});
