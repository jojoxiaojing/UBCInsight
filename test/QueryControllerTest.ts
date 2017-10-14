import {expect} from 'chai';
import QueryController from "../src/controller/QueryController/QueryController";
import MockData from "./MockDataTest";

describe("QueryController", function () {
    var testQuery: any= {WHERE:{GT:{courses_avg :97}}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"]}};

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

    var testQueryComplete = {WHERE: {AND: [{LT: {courses_audit: 30}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 50}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}

    var testQueryObject = testQuery;
    var testQueryObjectBroken = JSON.parse(testQueryBroken);

    var qC: QueryController = null;
    var qCBroken: QueryController = null;
    var qCComplete: QueryController = null;

    beforeEach(function () {
        qC = new QueryController(testQuery, new MockData().getData());
        qCComplete = new QueryController(testQueryComplete, new MockData().getData());
    });

    afterEach(function () {
        qC = null;
        qCComplete = null;
    });

    it("Test QueryController constructor without Options", function () {
        let out = qC.getQuery();
        expect(out).to.have.property('WHERE');
        expect(out).to.have.property('OPTIONS');
        expect(out).to.deep.equal(testQueryObject);
    });

    it("Test QueryController constructor with Options", function () {
        let out = qCComplete.getQuery();
        expect(out).to.have.property('WHERE');
        expect(out).to.have.property('OPTIONS');
        expect(out).to.deep.equal(testQueryComplete);
        let out2 = qCComplete.getQueryBody();
        expect(out2.getQueryOpt().options.COLUMNS.length).to.deep.equal(2)
        //let out3 = out2.applyFilter();
    });

    it("Test QueryController constructor error", function () {
        try {
            new QueryController(testQueryBroken, new MockData().getData());
        } catch(err) {
            expect(err).to.deep.equal("error: query is invalid");
        }
    });


    it("Test QueryController constructor, test attributes properly initialized", function () {
        qC.parseQueryBody();
        expect(qC.getQueryBody().getBody()).to.have.property("GT");
    });

    it("Test QueryBody Constructor, QueryObj", function () {
        qC.parseQueryBody()
        let qB = qC.getQueryBody();
        //qB.parseQueryFilters(qB.filters);
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(1);
    });

});
