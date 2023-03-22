import React from "react";
declare const VALID_CARD_TYPES: readonly ["amex", "dankort", "dinersclub", "discover", "elo", "hipercard", "jcb", "laser", "maestro", "mastercard", "mir", "troy", "unionpay", "visaelectron", "visa"];
export type ValidCardType = typeof VALID_CARD_TYPES[number];
interface IReactCreditCardsProps {
    number: string | number;
    cvc: string | number;
    expiry: string | number;
    name?: string;
    acceptedCards?: ValidCardType[];
    focused?: string;
    issuer?: string;
    locale?: {
        valid?: string;
    };
    placeholders?: {
        name?: string;
    };
    preview?: boolean;
    onNumberClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onCvvClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onNameClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onExpiryClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export declare const ReactCreditCards: ({ issuer: _issuer, preview, acceptedCards, cvc, expiry: _expiry, focused, locale, name, number, placeholders, onNumberClick, onCvvClick, onNameClick, onExpiryClick, }: IReactCreditCardsProps) => JSX.Element;
export default ReactCreditCards;
