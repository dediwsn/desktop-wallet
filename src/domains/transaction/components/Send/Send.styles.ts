export const defaultStyle = `
    .send-transaction {
        &__select-network {
            &:not([disabled]) {
                background-color: transparent;
                color: transparent;
            }
            option {
                color: var(--theme-color-neutral-900);
            }
        }

        &__select-contact {
            > div:first-child {
                width: 100%;
                svg {
                    display: none;
                }
            }

            select {
                &:not([disabled]) {
                    background-color: transparent;
                    color: transparent;
                }
                option {
                    color: var(--theme-color-neutral-900);
                }
            }
        }
    }
`;
