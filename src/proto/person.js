/* eslint-disable */

/**
 * This file was generated using ts-proto (v1.156.3), and then transpiled
 * to JS using tsc version 4.9.5 (Node16 module + moduleResolution).
 */
const m0 = require( 'protobufjs/minimal' );
const { Reader, Writer } = m0;
const protobufPackage = "";
let Color;
( function ( Color ) {
    Color[ Color[ "RED" ] = 0 ] = "RED";
    Color[ Color[ "BLUE" ] = 1 ] = "BLUE";
    Color[ Color[ "GREEN" ] = 2 ] = "GREEN";
    Color[ Color[ "UNRECOGNIZED" ] = -1 ] = "UNRECOGNIZED";
} )( Color || ( Color = {} ) );
function colorFromJSON( object ) {
    switch ( object ) {
        case 0:
        case "RED":
            return Color.RED;
        case 1:
        case "BLUE":
            return Color.BLUE;
        case 2:
        case "GREEN":
            return Color.GREEN;
        case -1:
        case "UNRECOGNIZED":
        default:
            return Color.UNRECOGNIZED;
    }
}
function colorToJSON( object ) {
    switch ( object ) {
        case Color.RED:
            return "RED";
        case Color.BLUE:
            return "BLUE";
        case Color.GREEN:
            return "GREEN";
        case Color.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
function createBasePerson() {
    return { id: "", name: undefined, ageInYears: 0, netWorth: 0, isBrave: false, favorite: 0 };
}
const Person = {
    encode( message, writer = Writer.create() ) {
        if ( message.id !== "" ) {
            writer.uint32( 10 ).string( message.id );
        }
        if ( message.name !== undefined ) {
            writer.uint32( 18 ).string( message.name );
        }
        if ( message.ageInYears !== 0 ) {
            writer.uint32( 24 ).int32( message.ageInYears );
        }
        if ( message.netWorth !== 0 ) {
            writer.uint32( 33 ).double( message.netWorth );
        }
        if ( message.isBrave === true ) {
            writer.uint32( 40 ).bool( message.isBrave );
        }
        if ( message.favorite !== 0 ) {
            writer.uint32( 48 ).int32( message.favorite );
        }
        return writer;
    },
    decode( input, length ) {
        const reader = input instanceof Reader ? input : Reader.create( input );
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePerson();
        while ( reader.pos < end ) {
            const tag = reader.uint32();
            switch ( tag >>> 3 ) {
                case 1:
                    if ( tag !== 10 ) {
                        break;
                    }
                    message.id = reader.string();
                    continue;
                case 2:
                    if ( tag !== 18 ) {
                        break;
                    }
                    message.name = reader.string();
                    continue;
                case 3:
                    if ( tag !== 24 ) {
                        break;
                    }
                    message.ageInYears = reader.int32();
                    continue;
                case 4:
                    if ( tag !== 33 ) {
                        break;
                    }
                    message.netWorth = reader.double();
                    continue;
                case 5:
                    if ( tag !== 40 ) {
                        break;
                    }
                    message.isBrave = reader.bool();
                    continue;
                case 6:
                    if ( tag !== 48 ) {
                        break;
                    }
                    message.favorite = reader.int32();
                    continue;
            }
            if ( ( tag & 7 ) === 4 || tag === 0 ) {
                break;
            }
            reader.skipType( tag & 7 );
        }
        return message;
    },
    fromJSON( object ) {
        return {
            id: isSet( object.id ) ? String( object.id ) : "",
            name: isSet( object.name ) ? String( object.name ) : undefined,
            ageInYears: isSet( object.ageInYears ) ? Number( object.ageInYears ) : 0,
            netWorth: isSet( object.netWorth ) ? Number( object.netWorth ) : 0,
            isBrave: isSet( object.isBrave ) ? Boolean( object.isBrave ) : false,
            favorite: isSet( object.favorite ) ? colorFromJSON( object.favorite ) : 0,
        };
    },
    toJSON( message ) {
        const obj = {};
        if ( message.id !== "" ) {
            obj.id = message.id;
        }
        if ( message.name !== undefined ) {
            obj.name = message.name;
        }
        if ( message.ageInYears !== 0 ) {
            obj.ageInYears = Math.round( message.ageInYears );
        }
        if ( message.netWorth !== 0 ) {
            obj.netWorth = message.netWorth;
        }
        if ( message.isBrave === true ) {
            obj.isBrave = message.isBrave;
        }
        if ( message.favorite !== 0 ) {
            obj.favorite = colorToJSON( message.favorite );
        }
        return obj;
    },
    create( base ) {
        return Person.fromPartial( base !== null && base !== void 0 ? base : {} );
    },
    fromPartial( object ) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBasePerson();
        message.id = ( _a = object.id ) !== null && _a !== void 0 ? _a : "";
        message.name = ( _b = object.name ) !== null && _b !== void 0 ? _b : undefined;
        message.ageInYears = ( _c = object.ageInYears ) !== null && _c !== void 0 ? _c : 0;
        message.netWorth = ( _d = object.netWorth ) !== null && _d !== void 0 ? _d : 0;
        message.isBrave = ( _e = object.isBrave ) !== null && _e !== void 0 ? _e : false;
        message.favorite = ( _f = object.favorite ) !== null && _f !== void 0 ? _f : 0;
        return message;
    },
};
function isSet( value ) {
    return value !== null && value !== undefined;
}

exports.Color = Color;
exports.colorFromJSON = colorFromJSON;
exports.colorToJSON = colorToJSON;
exports.Person = Person;
exports.protobufPackage = protobufPackage;
