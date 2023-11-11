export const _patternMail =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*$";

export const _patternCell = "^09[0-9]{8}$";

export const _patternAge = "^[0-9]{2}$";

export const _patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/;

export const _patterName =
  "^[a-zA-ZñÑáÁéÉíÍóÓúÚ]{2,20}( ([a-zA-ZñÑáÁéÉíÍóÓúÚ]{1,20})?)*$";

export const _patterDescription =
  "^[0-9a-zA-ZñÑáÁéÉíÍóÓúÚ.,]{1,30}( ([0-9a-zA-ZñÑáÁéÉíÍóÓúÚ.,]{1,30})?)*$";

export const _patterUsername = "^[a-zA-Z0-9_-]{4,16}$";
