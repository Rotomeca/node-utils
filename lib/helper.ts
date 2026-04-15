declare namespace Rotomeca {
    namespace Utils {
        namespace Helper {
            /**
             * @deprecated Utilisez `Record` à la place
             */
            type Dict<T> = {[key: string]: T};
            /**
             * Représente un nombre flottant
             * @deprecated Utilisez `float` à la place
             */
            type Float = number;
        }
    }
}