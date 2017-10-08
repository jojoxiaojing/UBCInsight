import {expect} from 'chai';
import QueryBody from "../src/controller/QueryController/QueryBody";
import MockData from "./MockDataTest";
import FilterOR from "../src/controller/QueryController/Filters/FilterLogic/FilterOR";
import QueryOptions from "../src/controller/QueryController/QueryOptions";

describe("QueryOptions", function () {

    var queryOptions =   {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"};
    var queryOptionsWrong1 =   {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_instructor"};
    var data = new MockData().getData();
    var queryOpt: QueryOptions = null;
    var queryOptWrong1: QueryOptions = null;

    beforeEach(function () {
        queryOpt = new QueryOptions(queryOptions, data);
        queryOptWrong1 = new QueryOptions(queryOptionsWrong1, data);
    });

    afterEach(function () {
        queryOpt = null;
        queryOptWrong1 = null;
    });


    it("Test QueryOptions Constructor/parseQueryOptions", function () {
        queryOpt.parseQueryOptions();
        expect(queryOpt.columns.length).to.deep.equal(2);
        expect(queryOpt.order).to.deep.equal("courses_avg");
        expect(queryOpt.checkOptionsValid()).to.deep.equal(true);
        //expect(queryOptWrong1.checkOptionsValid()).to.deep.equal(false);
    });

    it("Test applyQueryOptions to MockData", function () {
        queryOpt.parseQueryOptions();
        let response = queryOpt.applyOptions();
        expect(response[0].hasOwnProperty("courses_avg")).to.deep.equal(true);
        expect(response[0].hasOwnProperty("courses_fail")).to.deep.equal(false);
    });


});
