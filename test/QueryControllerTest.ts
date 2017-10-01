import {expect} from 'chai';
import QueryController from "../src/controller/QueryController/QueryController";

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
        qC = new QueryController(testQuery);
    });

    afterEach(function () {
        qC = null;
    });

    it("Test constructor", function () {
        let out = qC.getQuery();
        expect(out).to.have.property('WHERE');
        expect(out).to.have.property('OPTIONS');
        expect(out).to.deep.equal(testQueryObject);
    });

    it("Test constructor error", function () {
        try {
            new QueryController(testQueryBroken);
        } catch(err) {
            expect(err).to.deep.equal("error: query is invalid");
        }
    });

});
