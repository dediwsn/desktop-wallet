<template>
  <form
    class="TransactionFormBridgechain flex flex-col"
    @submit.prevent
  >
    <template>
      <ListDivided :is-floating-label="true">
        <ListDividedItem
          :label="$t('TRANSACTION.SENDER')"
          item-value-class="w-full"
        >
          <span class="break-words">
            {{ senderLabel }}
          </span>
          <span
            v-if="senderLabel !== currentWallet.address"
            class="text-sm text-theme-page-text-light"
          >
            {{ currentWallet.address }}
          </span>
        </ListDividedItem>
      </ListDivided>

      <div v-if="step === 1">
        <div
          class="flex"
        >
          <InputText
            ref="seedNode"
            v-model="$v.seedNode.$model"
            :helper-text="seedNodeError"
            :label="$t('TRANSACTION.BRIDGECHAIN.SEED_NODE')"
            :is-invalid="!!seedNodeError"
            name="seedNode"
            class="TransactionFormBridgechain__seed-node mr-4 flex-1"
          />

          <ButtonGeneric
            :disabled="seedNodeDisabled"
            :label="$t('TRANSACTION.BRIDGECHAIN.BUTTON_ADD')"
            class="TransactionFormBridgechain__add py-1 flex-inline h-8 mt-4 ml-4"
            @click="addSeedNode"
          />
        </div>

        <TransactionPeerList
          :title="$t('TRANSACTION.BRIDGECHAIN.SEED_NODES')"
          :items="$v.form.seedNodes.$model"
          :max-items="maxSeedNodes"
          :show-count="true"
          :is-invalid="hasSeedNodesError"
          :required="true"
          class="TransactionFormBridgechain__seed-nodes mt-4"
          @remove="emitRemoveSeedNode"
        />
      </div>

      <div v-if="step === 2">
        <div v-if="!isUpdate">
          <InputText
            v-model="$v.form.asset.name.$model"
            :helper-text="nameError"
            :label="$t('TRANSACTION.BRIDGECHAIN.NAME')"
            :is-invalid="!!nameError"
            class="TransactionFormBridgechain__name mb-5"
            name="name"
          />

          <InputText
            v-model="$v.form.asset.genesisHash.$model"
            :helper-text="genesisHashError"
            :label="$t('TRANSACTION.BRIDGECHAIN.GENESIS_HASH')"
            :is-invalid="!!genesisHashError"
            class="TransactionFormBridgechain__genesis-hash mb-5"
            name="genesisHash"
          />
        </div>

        <InputText
          v-model="$v.form.asset.bridgechainRepository.$model"
          :helper-text="bridgechainRepositoryError"
          :label="$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')"
          :is-invalid="!!bridgechainRepositoryError"
          class="TransactionFormBridgechain__bridgechain-repository mb-5"
          name="repository"
        />

        <InputText
          v-model="$v.form.asset.bridgechainAssetRepository.$model"
          :helper-text="bridgechainAssetRepositoryError"
          :label="$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_ASSET_REPOSITORY')"
          :is-invalid="!!bridgechainAssetRepositoryError"
          class="TransactionFormBridgechain__bridgechain-asset-repository mb-5"
          name="repository"
        />

        <InputText
          v-model="$v.form.apiPort.$model"
          :helper-text="apiPortError"
          :label="$t('TRANSACTION.BRIDGECHAIN.API_PORT')"
          :is-invalid="!!apiPortError"
          type="number"
          class="TransactionFormBridgechain__api-port mb-5"
          name="apiPort"
        />

        <InputFee
          ref="fee"
          :currency="walletNetwork.token"
          :transaction-group="$options.transactionGroup"
          :transaction-type="$options.transactionType"
          :show-insufficient-funds="true"
          class="TransactionFormBridgechain__fee"
          @input="onFee"
        />

        <div v-if="!isMultiSignature">
          <div
            v-if="currentWallet.isLedger"
            class="TransactionFormBridgechain__ledger-notice mt-10"
          >
            {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
          </div>

          <InputPassword
            v-else-if="currentWallet.passphrase"
            ref="password"
            v-model="$v.form.walletPassword.$model"
            :label="$t('TRANSACTION.PASSWORD')"
            :is-required="true"
            class="TransactionFormBridgechain__password mt-4"
          />

          <PassphraseInput
            v-else
            ref="passphrase"
            v-model="$v.form.passphrase.$model"
            :address="currentWallet.address"
            :pub-key-hash="walletNetwork.version"
            class="TransactionFormBridgechain__passphrase mt-4"
          />
        </div>

        <PassphraseInput
          v-if="currentWallet.secondPublicKey"
          ref="secondPassphrase"
          v-model="$v.form.secondPassphrase.$model"
          :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
          :pub-key-hash="walletNetwork.version"
          :public-key="currentWallet.secondPublicKey"
          class="TransactionFormBridgechain__second-passphrase mt-5"
        />
      </div>

      <footer class="mt-4 flex justify-between items-center">
        <div class="self-start">
          <button
            :disabled="step === 1"
            class="TransactionFormBridgechain__prev blue-button"
            @click="previousStep"
          >
            {{ $t('COMMON.PREV') }}
          </button>

          <button
            :disabled="!isFormValid"
            class="TransactionFormBridgechain__next blue-button"
            @click="nextStep"
          >
            {{ $t('COMMON.NEXT') }}
          </button>
        </div>
      </footer>

      <ModalLoader
        ref="modalLoader"
        :message="$t('ENCRYPTION.DECRYPTING')"
        :visible="showEncryptLoader"
      />
      <ModalLoader
        :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
        :visible="showLedgerLoader"
      />
      <ModalLoader
        :message="$t('MODAL_PEER.VALIDATING')"
        :allow-close="true"
        :visible="showValidatingModal"
      />
    </template>
  </form>
</template>

<script type="text/javascript">
import { ipAddress, maxLength, minLength, numeric, required, url } from 'vuelidate/lib/validators'
import { ButtonGeneric } from '@/components/Button'
import { InputFee, InputPassword, InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionPeerList from '@/components/Transaction/TransactionPeerList'
import mixin from '@/components/Transaction/TransactionForm/mixin'

const maxNameLength = 40
const maxSeedNodes = 10
const minRepositoryLength = 12

export default {
  components: {
    ButtonGeneric,
    InputFee,
    InputPassword,
    InputText,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput,
    TransactionPeerList
  },

  mixins: [mixin],

  data: () => ({
    step: 1,
    seedNode: '',
    showValidatingModal: false,
    invalidSeeds: [],
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: '',
      apiPort: 4003,
      seedNodes: [],
      asset: {
        name: '',
        ports: {},
        genesisHash: '',
        bridgechainRepository: '',
        bridgechainAssetRepository: ''
      }
    }
  }),

  computed: {
    maxSeedNodes () {
      return maxSeedNodes
    },

    isUpdate () {
      return !!this.bridgechain
    },

    isFormValid () {
      if (this.step === 1) {
        return !this.$v.form.seedNodes.$invalid
      }

      if (this.step === 2 && this.isUpdate) {
        return !this.$v.form.$invalid && !(
          this.hasSameRepository &&
          this.hasSameAssetRepository &&
          this.hasSameSeedNodes &&
          this.hasSamePorts
        )
      }

      return !this.$v.form.$invalid
    },

    hasSameRepository () {
      return this.form.asset.bridgechainRepository === this.bridgechain.bridgechainRepository
    },

    hasSameAssetRepository () {
      return (
        this.form.asset.bridgechainAssetRepository === this.bridgechain.bridgechainAssetRepository ||
        (!this.form.asset.bridgechainAssetRepository && (this.bridgechain.bridgechainAssetRepository === undefined))
      )
    },

    hasSameSeedNodes () {
      return (
        this.form.seedNodes.length === this.bridgechain.seedNodes.length &&
        this.form.seedNodes.every(seedNode => this.bridgechain.seedNodes.includes(seedNode.ip))
      )
    },

    // will have to be adjusted when multiple ports are supported in the wallet
    hasSamePorts () {
      return parseInt(this.form.apiPort) === this.bridgechain.ports['@arkecosystem/core-api']
    },

    nameError () {
      if (this.$v.form.asset.name.$dirty && this.$v.form.asset.name.$invalid) {
        if (!this.$v.form.asset.name.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.NAME')])
        } else if (!this.$v.form.asset.name.tooLong) {
          return this.$t('VALIDATION.TOO_LONG', [this.$t('TRANSACTION.BRIDGECHAIN.NAME')])
        } else if (!this.$v.form.asset.name.validName) {
          return this.$t('VALIDATION.NOT_VALID', [this.$t('TRANSACTION.BRIDGECHAIN.NAME')])
        }
      }

      return null
    },

    seedNodeDisabled () {
      return !this.$v.seedNode.$model.length || !!this.seedNodeError
    },

    hasSeedNodesError () {
      return this.invalidSeeds.length > 0 || this.form.seedNodes.length > this.maxSeedNodes
    },

    seedNodeError () {
      if (this.$v.seedNode.$dirty && this.$v.seedNode.$invalid) {
        if (!this.$v.seedNode.isValidSeed) {
          return this.$t('VALIDATION.INVALID_SEED')
        } else if (!this.$v.seedNode.isUnique) {
          return this.$t('TRANSACTION.BRIDGECHAIN.ERROR_DUPLICATE')
        }
      }

      return null
    },

    genesisHashError () {
      if (this.$v.form.asset.genesisHash.$dirty && this.$v.form.asset.genesisHash.$invalid) {
        if (!this.$v.form.asset.genesisHash.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.GENESIS_HASH')])
        } else if (!this.$v.form.asset.genesisHash.isValidHash) {
          return this.$t('VALIDATION.NOT_VALID', [this.$t('TRANSACTION.BRIDGECHAIN.GENESIS_HASH')])
        }
      }

      return null
    },

    bridgechainRepositoryError () {
      if (this.$v.form.asset.bridgechainRepository.$dirty && this.$v.form.asset.bridgechainRepository.$invalid) {
        if (!this.$v.form.asset.bridgechainRepository.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')])
        } else if (!this.$v.form.asset.bridgechainRepository.url) {
          return this.$t('VALIDATION.INVALID_URL')
        } else if (!this.$v.form.asset.bridgechainRepository.tooShort) {
          return this.$t('VALIDATION.TOO_SHORT', [this.$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')])
        }
      }

      return null
    },

    bridgechainAssetRepositoryError () {
      if (this.$v.form.asset.bridgechainAssetRepository.$dirty && this.$v.form.asset.bridgechainAssetRepository.$invalid) {
        if (!this.$v.form.asset.bridgechainAssetRepository.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_ASSET_REPOSITORY')])
        } else if (!this.$v.form.asset.bridgechainAssetRepository.url) {
          return this.$t('VALIDATION.INVALID_URL')
        }
      }

      return null
    },

    apiPortError () {
      if (this.$v.form.apiPort.$dirty && this.$v.form.apiPort.$invalid) {
        if (!this.$v.form.apiPort.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.API_PORT')])
        } else if (!this.$v.form.apiPort.isNumeric) {
          return this.$t('VALIDATION.NOT_NUMERIC', [this.$t('TRANSACTION.BRIDGECHAIN.API_PORT')])
        } else if (!this.$v.form.apiPort.isValidPort) {
          return this.$t('VALIDATION.INVALID_PORT')
        }
      }

      return null
    }
  },

  methods: {
    getTransactionData () {
      const bridgechainAsset = Object.assign({}, this.form.asset)

      // will have to be adjusted when multiple ports are supported in the wallet
      bridgechainAsset.ports['@arkecosystem/core-api'] = parseInt(this.form.apiPort)
      bridgechainAsset.seedNodes = this.form.seedNodes.map(seedNode => seedNode.ip)

      if (this.isUpdate) {
        bridgechainAsset.bridgechainId = bridgechainAsset.genesisHash

        delete bridgechainAsset.name
        delete bridgechainAsset.genesisHash

        if (this.hasSameRepository) {
          delete bridgechainAsset.bridgechainRepository
        }

        if (this.hasSameAssetRepository) {
          delete bridgechainAsset.bridgechainAssetRepository
        }

        if (this.hasSameSeedNodes) {
          delete bridgechainAsset.seedNodes
        }

        if (this.hasSamePorts) {
          delete bridgechainAsset.ports
        }
      } else {
        if (!bridgechainAsset.bridgechainAssetRepository || !bridgechainAsset.bridgechainAssetRepository.length) {
          delete bridgechainAsset.bridgechainAssetRepository
        }
      }

      const transactionData = {
        address: this.currentWallet.address,
        asset: bridgechainAsset,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      return transactionData
    },

    previousStep () {
      if (this.step === 2) {
        this.step = 1
      }
    },

    async nextStep () {
      if (this.step === 1) {
        this.step = 2

        const fee = this.$v.form.fee.$model

        await this.$nextTick()

        // TODO: Figure out why fee vuelidate intermittently doesn't
        //       trigger resulting in an "invalid" flag when it's not.
        //       Remove assigning fee to zero initially as a workaround.
        if (this.$refs.fee && fee) {
          this.$refs.fee.emitFee(0)
          await this.$nextTick()
          this.$refs.fee.emitFee(fee)
        }

        if (this.$v.form.passphrase.$model) {
          this.$refs.passphrase.touch()
        } else if (this.$v.form.walletPassword.$model) {
          this.$v.form.walletPassword.$touch()
        }

        if (this.$v.form.secondPassphrase.$model) {
          this.$refs.secondPassphrase.touch()
        }
      } else {
        await this.validateSeeds()

        if (!this.invalidSeeds.length) {
          this.$v.form.fee.$model = this.$refs.fee.fee
          this.onSubmit()
        } else {
          this.step = 1
        }
      }
    },

    addSeedNode () {
      if (this.$v.seedNode.$invalid) {
        return
      }

      this.$v.form.seedNodes.$model.push({
        ip: this.seedNode,
        isInvalid: false
      })

      this.$refs.seedNode.reset()
      this.$v.seedNode.$reset()
    },

    emitRemoveSeedNode (index) {
      if (!Object.prototype.hasOwnProperty.call(this.$v.form.seedNodes.$model, index)) {
        return
      }

      this.$v.form.seedNodes.$model = [
        ...this.form.seedNodes.slice(0, index),
        ...this.form.seedNodes.slice(index + 1)
      ]
    },

    async validateSeeds () {
      this.showValidatingModal = true

      const invalidSeeds = []
      for (const seedNode of this.form.seedNodes) {
        let isValid = true

        try {
          const response = await this.$store.dispatch('peer/validatePeer', {
            ip: seedNode.ip,
            port: this.form.apiPort,
            nethash: this.form.asset.genesisHash
          })

          if (response === false || typeof response === 'string') {
            isValid = false
          }
        } catch (error) {
          isValid = false
          this.$logger.error('Could not validate seeds: ', error)
        }

        if (!isValid) {
          seedNode.isInvalid = true
          invalidSeeds.push(seedNode)
        }
      }

      this.invalidSeeds = invalidSeeds
      if (invalidSeeds.length) {
        this.$error(this.$tc('TRANSACTION.BRIDGECHAIN.INVALID_SEEDS', invalidSeeds.length))
      }

      this.showValidatingModal = false
    }
  },

  validations: {
    seedNode: {
      isUnique (value) {
        return !this.form.seedNodes.find(seedNode => seedNode.ip === value)
      },
      isValidSeed (value) {
        return ipAddress(value)
      }
    },

    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase,

      apiPort: {
        required,
        isNumeric: numeric,

        isValidPort (value) {
          return parseInt(value) < 65536
        }
      },

      seedNodes: {
        required,
        belowOrEqualMaximum (value) {
          return value.length <= maxSeedNodes
        }
      },

      asset: {
        name: {
          required (value) {
            return this.bridgechain ? true : required(value)
          },
          tooLong (value) {
            return this.bridgechain ? true : maxLength(maxNameLength)(value)
          },
          validName (value) {
            return this.bridgechain ? true : /^[a-zA-Z0-9]+(( - |[ ._-])[a-zA-Z0-9]+)*[.]?$/.test(value)
          }
        },

        genesisHash: {
          required (value) {
            return this.bridgechain ? true : required(value)
          },
          isValidHash (value) {
            return this.bridgechain ? true : /^[a-z0-9]{64}$/.test(value)
          }
        },

        bridgechainRepository: {
          required (value) {
            return this.bridgechain ? true : required(value)
          },
          tooShort (value) {
            if (this.bridgechain) {
              if (value) {
                return minLength(minRepositoryLength)(value)
              }
              return true
            }
            return minLength(minRepositoryLength)(value)
          },
          url (value) {
            return url(value)
          }
        },

        bridgechainAssetRepository: {
          required (value) {
            return (this.bridgechain && this.bridgechain.bridgechainAssetRepository) ? required(value) : true
          },
          url (value) {
            return url(value)
          }
        }
      }
    }
  }
}
</script>

<style>
.TransactionFormBridgechain__seed-nodes .InputEditableList__list {
  max-height: 13rem;
}
</style>
