/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import QueryController from "./QueryController/QueryController";
import {isUndefined} from "util";
import DataController from "./DataController";
var fs = require("fs");


export default class InsightFacade implements IInsightFacade {
    //dataInMemory:Map<string,any[]>;
    dataController: DataController = new DataController();


    constructor() {
        //Log.trace('InsightFacadeImpl::init()');
        //this.dataInMemory= new Map<string,any[]>();
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise((fulfill, reject)=> {
            try {
                let dataController = this.dataController;
                var c: number;
                if (dataController.getDataset(id) == null || dataController.getDataset(id) == {}){
                    c = 204;
                } else {
                    c = 201;
                }
                if (id === "courses") {
                    dataController.processCourses(id, content).then((value: boolean)=>{
                        if (value === true) {
                            fulfill({code: c, body: {}});
                        } else {
                            throw new Error("Dataset is invalid")
                        }
                    }).catch(function (err: Error) {
                        reject({code: 400, error: 'error'});
                    });
                } else if (id === "rooms") {
                    //TODO: insert the call to processRooms(...)
                } else {
                    reject({code: 400, error: 'error'});
                }
            } catch (err) {
                reject({code:400, error: err});
            }
        });
    }


    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;

        return new Promise<InsightResponse>((fullfill, reject) =>{
            try{
                let ifFileExist = fs.existsSync('./src/controller/' + id + '.txt');
                var s: InsightResponse = {
                    code: 204,
                    body: {}
                };

                if((!ifFileExist && !(this.dataController.dataInMemory.has(id))) || (id !== 'courses' && id !== 'rooms')){
                    s.code = 404;
                    s.body = {error: "dataset not in memory"}
                    reject(s);
                }

                if(ifFileExist){
                    fs.unlink(__dirname + "/" + id + ".txt");
                }

                if(this.dataController.dataInMemory.has(id)){
                    this.dataController.dataInMemory.delete(id);
                }
                fullfill(s);

            }catch(err){
                s.code = 404;
                s.body = {error: "something went wrong"}
                reject(s);
            }
        });
    }

    performQuery(query: any): Promise <InsightResponse> {

        var s: InsightResponse = {code: null, body: {}};
        var queryController = new QueryController(query, []);
        let that = this;
        var dataCntrl = that.getDataController();
        var data = dataCntrl.getDataInMemory();

        return new Promise<InsightResponse>((fullfill, reject) =>{
            //initialize response variable
            var s: InsightResponse = {code: null, body: {}};
            if (!(data.has("courses"))) {
                if (!fs.existsSync(__dirname + "/courses.txt")) {
                    s.code = 424;
                    s.body = {error:"missing dataset"}
                    reject(s);
                    //return;
                }else{
                    let data = fs.readFileSync(__dirname  + "/courses.txt", 'utf-8');

                    let tempData = JSON.parse(data);

                    if (!queryController.isValid()){
                        s.code = 400;
                        s.body = {error:"query invalid"};
                        reject(s);
                    } else
                    {
                        s.code = 200;
                        var output: any = {result: []}
                        output.result = this.processData(tempData, queryController)

                        s.body = output;
                        fullfill(s);
                    }
                }
            } else {
                let tempData = data.get("courses");
                if (!queryController.isValid()) {
                    s.code = 400;
                    s.body = {error:"query invalid"};
                    reject(s);
                } else {
                    s.code = 200;
                    var output: any = {result: []}
                    output.result = this.processData(tempData, queryController)

                    s.body = output;
                    fullfill(s);
                }

            }
        });
    }

    getDataController(): DataController {
        return this.dataController;
    }



    processData(tempData: any[], qController: QueryController): any[] {
        let res: any[] = [];
        let val: any;
        for (val of tempData) {
            qController.setData(val);
            if (qController.getQueryBody().applyFilter()) res.push(val);
        }
        qController.getQueryBody().getQueryOpt().setOptionsData(res)
        return qController.getQueryBody().getQueryOpt().applyOptions();
    }
}