
//赠送礼物显示类型
export interface PresentShowConfig {
    id: number;
    avatar: string;
    handlerName: string;
    icon: string;
    liveId: string;
    name: string;
    pushType: string;
    realname: string;
    sendMessageType: string;
    swf: string;
}
//礼物列表类型
export interface PresentListConfig {
    id: string,
    icon: string,
    name: string,
    coin: number,
    swf: string
}

//赠送记录列表类型
export interface GiveListConfig {
    id: number;
    giftName: string;
    liveName: string;
    amount: number;
    createTime: string;
}