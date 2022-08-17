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
] as const;

export type ValidCardType = typeof VALID_CARD_TYPES[number];
interface IReactCreditCardsProps {
  number: string | number;
  cvc: string | number;
  expiry: string | number;
  // optionals
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
}

const getMaxLengthFromIssuer = (issuer: string) => {
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

const getVisibleCardNumber = (cardNumber: string, maxLength: number, preview: boolean, issuer: string) => {
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
      return `${nextNumber.substring(0, 4)} ${nextNumber.substring(4, 6)} ${nextNumber.substring(10, 5)}`;
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

const getVisibleExpiry = (expiry: string | number) => {
  const date = typeof expiry === "number" ? expiry.toString() : expiry;
  let month = "";
  let year = "";
  if (date.includes("/")) {
    [month, year] = date.split("/");
  } else if (date.length) {
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

export const ReactCreditCards = ({
  issuer: _issuer,
  preview = false,
  acceptedCards = [],
  cvc,
  expiry: _expiry,
  focused,
  locale = {
    valid: "valid thru",
  },
  name = "John Doe",
  number,
  placeholders = {
    name: "John Doe",
  },
}: IReactCreditCardsProps) => {
  const cardNumber = String(number);

  const inferredIssuer = Payment.fns.cardType(cardNumber) || "unknown";

  const issuer: string = preview && _issuer ? _issuer.toLowerCase() : inferredIssuer;
  const maxLength = preview ? 19 : getMaxLengthFromIssuer(inferredIssuer);
  const cleanedNumber = cardNumber.replace(/[A-Za-z]| /g, "");
  const numberToShow = getVisibleCardNumber(cleanedNumber, maxLength, preview, issuer);
  const expiry = getVisibleExpiry(_expiry);

  React.useEffect(() => {
    if (Array.isArray(acceptedCards) && acceptedCards.length) {
      const newCardArray: ReturnType<typeof Payment.getCardArray>[number][] = [];
      for (const d of Payment.getCardArray()) {
        if (acceptedCards.includes(d.type as ValidCardType)) {
          newCardArray.push(d);
        }
      }
      Payment.setCardArray(newCardArray);
      return;
    }
    Payment.setCardArray(Payment.getCardArray());
  }, []);

  const mainClassName = [
    "rccs__card",
    `rccs__card--${_issuer}`,
    focused === "cvc" && _issuer !== "amex" ? "rccs__card--flipped" : "",
  ]
    .join(" ")
    .trim();
  const nameClassname = ["rccs__name", focused === "name" ? "rccs--focused" : "", name ? "rccs--filled" : ""]
    .join(" ")
    .trim();
  const numberClassName = [
    "rccs__number",
    numberToShow.replace(/ /g, "").length > 16 ? "rccs__number--large" : "",
    focused === "number" ? "rccs--focused" : "",
    numberToShow.substring(0, 1) !== "•" ? "rccs--filled" : "",
  ]
    .join(" ")
    .trim();
  const cvcClassName = ["rccs__cvc__front", focused === "cvc" ? "rccs--focused" : ""].join(" ").trim();

  return (
    <div key="Cards" className="rccs">
      <div className={mainClassName}>
        <div className="rccs__card--front">
          <div className="rccs__card__background" />
          <div className="rccs__issuer" />
          <div className={cvcClassName}>{cvc}</div>
          <div className={numberClassName}>{numberToShow}</div>
          <div className={nameClassname}>{name || placeholders.name}</div>
          <div
            className={[
              "rccs__expiry",
              focused === "expiry" ? "rccs--focused" : "",
              expiry.substring(0, 1) !== "•" ? "rccs--filled" : "",
            ]
              .join(" ")
              .trim()}
          >
            <div className="rccs__expiry__valid">{locale.valid}</div>
            <div className="rccs__expiry__value">{expiry}</div>
          </div>
          <div className="rccs__chip" />
        </div>
        <div className="rccs__card--back">
          <div className="rccs__card__background" />
          <div className="rccs__stripe" />
          <div className="rccs__signature" />
          <div className={["rccs__cvc", focused === "cvc" ? "rccs--focused" : ""].join(" ").trim()}>{cvc}</div>
          <div className="rccs__issuer" />
        </div>
      </div>
    </div>
  );
};
export default ReactCreditCards;
