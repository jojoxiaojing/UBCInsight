import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testPerformQuery", function() {
    this.timeout(10000);
    var insightF: InsightFacade;
    before(function () {
        insightF = new InsightFacade();
        insightF.removeDataset('courses');
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    after(function() {
        insightF.removeDataset('courses');
    })
//Not in memory


    it("Test performQuery, when no dataset has been added ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "math"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect.fail();
        }).catch(function(value:any){
            expect(value.code).to.equal(424);
        });
    });

    it("Import course.zip and store the data, it should return code 204", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            let a = value;
            expect(a.code).to.deep.equal(204);
            let dataID = insightF.getDataController().getDataInMemory().has("courses");
            expect(dataID).to.be.true;
            let dataSize = insightF.getDataController().getDataInMemory().get("courses").length;
            expect(dataSize).to.equal(64612)
        }).catch(function (err) {
            expect.fail();
        });
    });



    it("Test performQuery, just IS with no *, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "math"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(2772);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just IS with one * at the beginning, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "*ps"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(806);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });


    it("Test performQuery, just IS with one * at the end, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "cp*"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(1155);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just IS with two * at the beginning and in the end, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "*ps*"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(5073);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just EQ, it should return 200 and 107 length of data ", function () {
        var testQuery ={"WHERE": {"EQ": {"courses_pass": 100}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(107);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just GT, it should return 200 and 9091 length of data ", function () {
        var testQuery ={"WHERE": {"GT": {"courses_pass": 99}}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(9091);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just LT, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"LT": {"courses_pass": 3}}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(439);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just AND, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"AND":[{"LT": {"courses_pass": 10}},{"GT": {"courses_avg": 90}}]}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(1034);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just OR, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"OR":[{"LT": {"courses_pass": 3}},{"GT": {"courses_avg": 99}}]}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(442);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });




    it("Test performQuery, real query, it should return 200 and 162 length of data ", function () {
        var testQuery = {"WHERE":{"AND": [{"GT": {"courses_audit": 2}}, {"OR": [{"GT": {"courses_fail": 10}}, {"GT": {"courses_pass": 100}}]}]}, "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(162);
            let n =Object.keys(value.body.result[1]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, real query and the data length should be 1 ", function () {
        var testQuery = {
            "WHERE":{
                "AND":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    {
                        "GT":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        return insightF.performQuery(testQuery).then(function(value:any){
            let a = value;
            expect(value.code).to.equal(200);
            let m = value.body.result.length;
            expect(m).to.equal(1);
            let n =Object.keys(value.body.result[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });

    });



    //Test if there is no such dataset


    it("Already in memory:Test performQuery, real query ", function (done) {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        insightF.addDataset("courses", data).then(()=> {
            var testQuery = {
                WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]},
                OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}
            }
        }).then(()=>{insightF.performQuery({
            WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]},
            OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}
        }).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });
        done()
    });



    it("Already in memory:Test performQuery, real query with NOT... LT AND GT ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            var testQuery = {WHERE: {NOT: {GT: {courses_pass: 100}}}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });
    });

    it("Already in memory:Test performQuery, real query with IS dept, COLUMN courses ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            var testQuery = {WHERE: {IS: {"courses_dept": "math"}}, OPTIONS: {COLUMNS: ["courses_title", "courses_instructor"], ORDER: "courses_title"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });
    });

    it("Test performQuery, invalid query returning 400 code: WHERE is misspelled", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            var testQuery = {THERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect.fail();
                //expect(value.code).to.equal(400);
                //done();

            }).catch(function(value:any){
                expect(value.code).to.equal(400);
                done();
            });
        });
    });

    it("Test performQuery, invalid query returning 400 code: GT has string input", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            var testQuery = {WHERE: {AND: [{NOT: {GT: {courses_audit: 2}}}, {AND: [{GT: {courses_fail: "a"}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect.fail();
            }).catch(function(value:any){
                expect(value.code).to.equal(400);
                done();
            });
        });
    });

    it("Test performQuery, when datasets was removed before should give code 424", function (done) {
        fs.readFile(__dirname + '/data/courses.zip', "base64", function(err:any, data:string) {
            insightF.removeDataset('courses').then(()=> {
                var testQuery = {WHERE: {AND: [{NOT: {GT: {courses_audit: 2}}}, {AND: [{GT: {courses_fail: 1}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
                insightF.performQuery(testQuery).then(function(value:any){
                    expect.fail();
                    done();
                }).catch(function(value:any){
                    expect(value.code).to.equal(424);
                    done();
                });
            }).catch(()=>{
                expect.fail()
                done();
            })

        });
    });


        it("Already in memory:Test performQuery with courses_year ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            var testQuery ={"WHERE":{"LT": {"courses_year": 2000}}, "OPTIONS":{"COLUMNS":[ "courses_dept", "courses_id","courses_avg"],"ORDER":"courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });
    });


    it("Already in memory:Test performQuery with courses_year in the options ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            var testQuery ={"WHERE":{"GT": {"courses_year": 1900}}, "OPTIONS":{"COLUMNS":[ "courses_dept", "courses_year","courses_avg"],"ORDER":"courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });
    });


    it("Test performQuery with invalid query: keys are from both rooms and courses ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("courses", data).then(function (value: any) {
            var testQuery ={"WHERE":{"LT": {"courses_year": 2000}}, "OPTIONS":{"COLUMNS":[ "rooms_fullname", "courses_id","courses_avg"],"ORDER":"courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
               expect.fail()

            }).catch(function(err:any){
                expect(err.code).to.equal(400);
            });
        }).catch(function (err) {
            expect.fail();
        });
    });


})