import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Payment from "payment";
const VALID_CARD_TYPES = [
    "amex",
    "dankort",
    "dinersclub",
    "discover",
    "elo",
    "hipercard",
    "jcb",
    "laser",
    "maestro",
    "mastercard",
    "mir",
    "troy",
    "unionpay",
    "visaelectron",
    "visa",
];
const getMaxLengthFromIssuer = (issuer) => {
    switch (issuer) {
        case "amex":
            return 15;
        case "diners":
        case "dinersclub":
            return 14;
        case "hipercard":
        case "mastercard":
        case "visa":
            return 19;
        default:
            return 16;
    }
};
const getVisibleCardNumber = (cardNumber, maxLength, preview, issuer) => {
    let nextNumber = cardNumber;
    if (isNaN(parseInt(nextNumber, 10)) && !preview) {
        nextNumber = "";
    }
    if (maxLength > 16) {
        maxLength = nextNumber.length <= 16 ? 16 : maxLength;
    }
    if (nextNumber.length > maxLength) {
        nextNumber = nextNumber.slice(0, maxLength);
    }
    while (nextNumber.length < maxLength) {
        nextNumber += "•";
    }
    switch (issuer) {
        case "amex":
        case "dinersclub":
        case "diners":
            return `${nextNumber.substring(0, 4)} ${nextNumber.substring(4, 10)} ${nextNumber.substring(10, 15)}`;
        default:
            if (nextNumber.length > 16) {
                const format = [0, 4, 8, 12];
                const limit = [4, 7];
                const one = nextNumber.substring(format[0], limit[0]);
                const two = nextNumber.substring(format[1], limit[0]);
                const three = nextNumber.substring(format[2], limit[0]);
                const four = nextNumber.substring(format[3], limit[1]);
                return `${one} ${two} ${three} ${four}`;
            }
            for (let i = 1; i < maxLength / 4; i++) {
                const space_index = i * 4 + (i - 1);
                nextNumber = `${nextNumber.slice(0, space_index)} ${nextNumber.slice(space_index)}`;
            }
            return nextNumber;
    }
};
const getVisibleExpiry = (expiry) => {
    const date = typeof expiry === "number" ? expiry.toString() : expiry;
    let month = "";
    let year = "";
    if (date.includes("/")) {
        [month, year] = date.split("/");
    }
    else if (date.length) {
        month = date.substring(0, 2);
        year = date.substring(2, 6);
    }
    while (month.length < 2) {
        month += "•";
    }
    if (year.length > 2) {
        year = year.substring(2, 4);
    }
    while (year.length < 2) {
        year += "•";
    }
    return `${month}/${year}`;
};
const getClassName = (classes) => {
    return (classes || []).join(" ").trim();
};
const ORIGINAL_CARD_ARRAY = Payment.getCardArray();
export const ReactCreditCards = ({ issuer: _issuer, preview = false, acceptedCards = [], cvc, expiry: _expiry, focused, locale = {
    valid: "valid thru",
}, name = "John Doe", number, placeholders = {
    name: "John Doe",
}, onNumberClick, onCvvClick, onNameClick, onExpiryClick, }) => {
    const cardNumber = String(number);
    const inferredIssuer = Payment.fns.cardType(cardNumber) || "unknown";
    const issuer = preview && _issuer ? _issuer.toLowerCase() : inferredIssuer;
    const maxLength = preview ? 19 : getMaxLengthFromIssuer(inferredIssuer);
    const cleanedNumber = cardNumber.replace(/[A-Za-z]| /g, "");
    const numberToShow = getVisibleCardNumber(cleanedNumber, maxLength, preview, issuer);
    const expiry = getVisibleExpiry(_expiry);
    React.useEffect(() => {
        if (Array.isArray(acceptedCards) && acceptedCards.length) {
            const newCardArray = [];
            for (const d of Payment.getCardArray()) {
                if (acceptedCards.includes(d.type)) {
                    newCardArray.push(d);
                }
            }
            Payment.setCardArray(newCardArray);
            return;
        }
        Payment.setCardArray(ORIGINAL_CARD_ARRAY);
    }, [acceptedCards]);
    const mainClassName = getClassName([
        "rccs__card",
        `rccs__card--${issuer}`,
        focused === "cvc" && issuer !== "amex" ? "rccs__card--flipped" : "",
    ]);
    const nameClassname = getClassName([
        "rccs__name",
        focused === "name" ? "rccs--focused" : "",
        name ? "rccs--filled" : "",
        onNameClick ? "clickable" : "",
    ]);
    const numberClassName = getClassName([
        "rccs__number",
        numberToShow.replace(/ /g, "").length > 16 ? "rccs__number--large" : "",
        focused === "number" ? "rccs--focused" : "",
        numberToShow.substring(0, 1) !== "•" ? "rccs--filled" : "",
        onNumberClick ? "clickable" : "",
    ]);
    const cvcClassName = getClassName([
        "rccs__cvc__front",
        focused === "cvc" ? "rccs--focused" : "",
        onCvvClick ? "clickable" : "",
    ]);
    const expiryClassName = getClassName([
        "rccs__expiry",
        focused === "expiry" ? "rccs--focused" : "",
        expiry.substring(0, 1) !== "•" ? "rccs--filled" : "",
        onExpiryClick ? "clickable" : "",
    ]);
    const cvvClassName = getClassName([
        "rccs__cvc",
        focused === "cvc" ? "rccs--focused" : "",
        onCvvClick ? "clickable" : "",
    ]);
    return (_jsx("div", { className: "rccs", children: _jsxs("div", { className: mainClassName, children: [_jsxs("div", { className: "rccs__card--front", children: [_jsx("div", { className: "rccs__card__background" }), _jsx("div", { className: "rccs__issuer" }), _jsx("div", { className: cvcClassName, onClick: onCvvClick, children: cvc }), _jsx("div", { className: numberClassName, onClick: onNumberClick, children: numberToShow }), _jsx("div", { className: nameClassname, onClick: onNameClick, children: name || placeholders.name }), _jsxs("div", { className: expiryClassName, onClick: onExpiryClick, children: [_jsx("div", { className: "rccs__expiry__valid", children: locale.valid }), _jsx("div", { className: "rccs__expiry__value", children: expiry })] }), _jsx("div", { className: "rccs__chip" })] }), _jsxs("div", { className: "rccs__card--back", children: [_jsx("div", { className: "rccs__card__background" }), _jsx("div", { className: "rccs__stripe" }), _jsx("div", { className: "rccs__signature" }), _jsx("div", { className: cvvClassName, onClick: onCvvClick, children: cvc }), _jsx("div", { className: "rccs__issuer" })] })] }) }, "Cards"));
};
export default ReactCreditCards;
