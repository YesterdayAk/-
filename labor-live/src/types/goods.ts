//购物车列表类型
export interface shoppingListConfig {
    index: number,
    deptName: string,
    liveGoodsList: Array<any>,
}

//商品列表类型
export interface liveGoodsListConfig {
    goodsId: number,
    goodsName: string,
    goodsPicture: string,
    price: number,
    stock: number,
}

//商品规格列表类型
export interface goodsSpecListConfig {
    index: number,
    key: number,
    goods_spec_name: string,
    goods_spec_value_string: string,
    goods_spec_value: Array<any>
}

//商品规格名列表类型
export interface goodsSpecValueConfig {
    i: number,
    goods_spec_value_name: string,
    isCheck: boolean,
}


