import Filter from "../Filter";

export default class FilterLogic extends Filter {
    filterNodes: Filter[];

    constructor(filter: any) {
        super();
        for (var key in filter) {
            this.filterNodes.push(filter[key]);
        }
    }

}





    // will need to apply parsing recursively depending on the type of sub-values found

/*    FILTER          ::= (LOGICCOMPARISON | MCOMPARISON | SCOMPARISON | NEGATION)


    LOGICCOMPARISON ::= LOGIC ':[{' FILTER ('}, {' FILTER )* '}]'

    MCOMPARISON     ::= MCOMPARATOR ':{' m_key ':' number '}'

    SCOMPARISON     ::= 'IS:{' s_key ':' [*]? inputstring [*]? '}'

    NEGATION        ::= 'NOT :{' FILTER '}'


    LOGIC           ::= 'AND' | 'OR'

    MCOMPARATOR     ::= 'LT' | 'GT' | 'EQ'*/
