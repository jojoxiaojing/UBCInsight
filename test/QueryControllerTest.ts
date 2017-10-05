import {expect} from 'chai';
import QueryController from "../src/controller/QueryController/QueryController";
import MockData from "./MockDataTest";

describe("QueryController", function () {
    var testQuery: string =
        "{\n" +
        "\n" +
        "  \"WHERE\":{\n" +
        "\n" +
        "     \"GT\":{\n" +
        "\n" +
        "        \"courses_avg\":97\n" +
        "\n" +
        "     }\n" +
        "\n" +
        "  },\n" +
        "\n" +
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


    var testQueryObject = JSON.parse(testQuery);
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

    it("Test QueryBody Constructor", function () {
        let qB = qC.getQueryObj();
        qB.parseQueryFilters(qB.filters);
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(1);
    });

    it("Test simple simple query", function () {
        let qB = qC.getQueryObj();
        qB.parseQueryFilters(qB.filters);
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(3);
    });


});
