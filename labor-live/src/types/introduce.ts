//说明列表类型
export interface IntroduceListConfig {
    id: number,
    message: string,
}

//评论信息列表类型
export interface CommentListConfig {
    id: number;
    avatar: string;
    message: string;
    realname: string;
    name: string,
    pushType: string,
}

//转盘信息列表类型
export interface LotteryListConfig {
    prizeTitle: string
    prizeId: number;
    fonts: [
        {
            text: string,
            top: string,
            fontColor: string,
            fontSize: string
        }
    ];
    background: string
}

//转盘中奖记录列表类型
export interface PrizeListConfig {
    activityRecordId: number;
    activityTitle: string;
    createTime: string;
    prizeType: string;
}
