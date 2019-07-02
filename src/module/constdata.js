/**
 * 定义一些全局常数
 */

/**
 * 车票类型
 */
export const TICKET_TYPE = {
  /**
   * 普通的商品订单
   */
  TICKET_TYPE_GOODS: -1,
  /**
   * 汽车票
   */
  TICKET_TYPE_CAR: 0,
  /**
   * 火车票
   */
  TICKET_TYPE_TRAIN: 1,
  /**
   * 虚拟充值订单
   */
  TICKET_TYPE_VIRTUAL: 2,
  /**
   * 酒店
   */
  TICKET_TYPE_HOTEL: 3,
  /**
   * 情侣会员卡
   */
  TICKET_TYPE_LOVE: 4,
  /**
   * 飞机
   */
  TICKET_TYPE_AIRPLANE: 5,
  /**
   * 电影
   */
  TICKET_TYPE_CINEMA: 6,
  /*
   * 拼团订单
   */
  TICKET_TYPE_PINKER: 7
}

/**
 * 出发地，or 目的地
 *
 */
export const PLACE_TYPE = {
  /**
   *  出发地
   */
  PLACE_TYPE_DEPART: 'depart',
  /**
   * 目的地
   */
  PLACE_TYPE_DESTINATION: 'destination'
}

/**
 * 抵扣金描述
 *
 */
export const DEDUCT_TYPE = {
  '11': '实名奖励（收入）',
  '12': '购物奖励（收入）',
  '14': '抵扣金还款返还（收入）',
  '22': '使用抵扣金还款（支出）',
  '15': '活动收入'
}
