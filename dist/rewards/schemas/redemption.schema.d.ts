import { Document } from 'mongoose';
export type RedemptionDocument = Redemption & Document;
export declare class Redemption {
    userId: string;
    pointsRedeemed: number;
    rewardType: string;
    timestamp: Date;
}
export declare const RedemptionSchema: import("mongoose").Schema<Redemption, import("mongoose").Model<Redemption, any, any, any, Document<unknown, any, Redemption, any> & Redemption & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Redemption, Document<unknown, {}, import("mongoose").FlatRecord<Redemption>, {}> & import("mongoose").FlatRecord<Redemption> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
