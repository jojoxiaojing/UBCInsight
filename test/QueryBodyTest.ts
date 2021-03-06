import {expect} from 'chai';
import QueryBody from "../src/controller/QueryController/QueryBody";
import MockData from "./MockDataTest";
import FilterOR from "../src/controller/QueryController/Filters/FilterLogic/FilterOR";

describe("QueryBody", function () {

    var testQuery = {OR: [{LT: {courses_audit: 20}}, {AND: [{EQ: {courses_avg: 90}}, {EQ: {courses_audit: 50}}]}]}

    var testQuery2 = {AND: [{LT: {courses_audit: 50}}, {OR: [{GT: {courses_fail: 10}}, {EQ: {courses_pass: 100}}]}]}

    var testQueryBroken: string =
        "{\n" +
        "  \"OPTIONS\":{\n" +
        "\n" +
        "     \"COLUMNS\":[\n" +
        "\n" +
        "        \"courses_dept\",\n" +
        "\n" +
        "        \"courses_avg\"\n" +
        "\n" +
        "     ],\n" +
        "\n" +
        "     \"ORDER\":\"courses_avg\"\n" +
        "\n" +
        "  }\n" +
        "\n" +
        "}";

    var testQueryBodyObject = testQuery;
    var testQueryBodyObjectBroken = JSON.parse(testQueryBroken);

    var qB: QueryBody = null;
    var qB2: QueryBody = null
    var qBBroken: QueryBody = null;

    var data = new MockData();

    beforeEach(function () {
        qB = new QueryBody(testQuery, data.getData());
        qB2 =  new QueryBody(testQuery2, data.getData());
        qBBroken = new QueryBody(JSON.parse(testQueryBroken), data.getData());
    });

    afterEach(function () {
        qB = null;
        qB2 = null;
        qBBroken = null;
    });


    it("Test QueryBody Constructor", function () {
        expect(qB.checkQueryValid()).to.deep.equal(true);
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(1);
    });

    it("Test QueryBody Constructor with no valid body", function () {

       //expect.fail(qBBroken.processQueryBody());
       //expect(qBBroken.processQueryBody()).to.throw(Error);

        //expect(qBBroken.checkQueryValid()).to.deep.equal(false);
        //let countFilters = qBBroken.filters;
        //expect(countFilters.length).to.deep.equal(0);
    });

    it("Test QueryBody Constructor, the right object is pushed in the attribute array", function () {
        let firstElement = qB.filters[0];
        expect(firstElement instanceof FilterOR).to.deep.equal(true);
    })

});
