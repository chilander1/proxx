import React from "react";
import styles from "./style.module.scss";

interface TProps {
  type?: "submit" | "button";
  children: React.ReactNode | string;
  color: "white" | "green" | "blue";
  onClick?: () => void;
}

const Button: React.FC<TProps> = ({ type, color, children, onClick }) => {
  return (
    <div className={styles.wrap}>
      <button type={type} className={styles[color]} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

Button.defaultProps = {
  type: "button",
  onClick: () => {},
};

export default Button;
