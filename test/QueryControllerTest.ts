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


    var testQueryObject = testQuery;
    var testQueryObjectBroken = JSON.parse(testQueryBroken);

    var qC: QueryController = null;
    var qCBroken: QueryController = null;

    beforeEach(function () {
        qC = new QueryController(testQuery, new MockData().getData());
    });

    afterEach(function () {
        qC = null;
    });

    it("Test QueryController constructor", function () {
        let out = qC.getQuery();
        expect(out).to.have.property('WHERE');
        expect(out).to.have.property('OPTIONS');
        expect(out).to.deep.equal(testQueryObject);
        expect(qC.getHasWhere()).deep.equal(true);
        expect(qC.getHasOptions()).deep.equal(true);
    });

    it("Test QueryController constructor error", function () {
        try {
            new QueryController(testQueryBroken, new MockData().getData());
        } catch(err) {
            expect(err).to.deep.equal("error: query is invalid");
        }
    });


    it("Test QueryController constructor, test attributes properly initialized", function () {
        expect(qC.getQueryObj().getBody()).to.have.property("GT");
    });

    it("Test QueryBody Constructor, QueryObj", function () {
        let qB = qC.getQueryObj();
        //qB.parseQueryFilters(qB.filters);
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(1);
    });

});
