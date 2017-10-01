import {expect} from 'chai';
import QueryBody from "../src/controller/QueryController/QueryBody";

describe("QueryBody", function () {
    var testQuery: string =
    "{\n" +
        "\n" +
        "     \"OR\":[\n" +
        "\n" +
        "        {\n" +
        "\n" +
        "           \"AND\":[\n" +
        "\n" +
        "              {\n" +
        "\n" +
        "                 \"GT\":{\n" +
        "\n" +
        "                    \"courses_avg\":90\n" +
        "\n" +
        "                 }\n" +
        "\n" +
        "              },\n" +
        "\n" +
        "              {\n" +
        "\n" +
        "                 \"LT\":{\n" +
        "\n" +
        "                    \"courses_avg\":99\n" +
        "\n" +
        "                 }\n" +
        "\n" +
        "              }\n" +
        "\n" +
        "           ]\n" +
        "\n" +
        "        },\n" +
        "\n" +
        "        {\n" +
        "\n" +
        "           \"EQ\":{\n" +
        "\n" +
        "              \"courses_avg\":95\n" +
        "\n" +
        "           }\n" +
        "\n" +
        "        }\n" +
        "\n" +
        "     ]\n" +
        "\n" +
        "}"

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

    var testQueryBodyObject = JSON.parse(testQuery);
    var testQueryBodyObjectBroken = JSON.parse(testQueryBroken);

    var qB: QueryBody = null;
    var qBBroken: QueryBody = null;

    beforeEach(function () {
        qB = new QueryBody(JSON.parse(testQuery));
        qBBroken = new QueryBody(JSON.parse(testQueryBroken));
    });

    afterEach(function () {
        qB = null;
        qBBroken = null;
    });


    it("Test QueryBody Constructor", function () {
        qB.parseQueryFilters();
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(1);
    });

    it("Test QueryBody Constructor with no valid body", function () {
        qBBroken.parseQueryFilters();
        let countFilters = qB.filters.length;
        expect(countFilters).to.deep.equal(0);
    });

/*    it("Test QueryBody Constructor, the right object is pushed in the attribute array", function () {
        qB.parseQueryFilters();
        let firstElement = qB.filters[0];
        expect(firstElement.filters[0]).to.deep.equal("FilterLogic");
    })*/

});
