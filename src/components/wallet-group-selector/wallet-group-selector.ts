import { Component } from '@angular/core';
import { Events, NavController, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

// Pages
import { AddWalletPage } from '../../pages/add-wallet/add-wallet';

// Providers
import { KeyProvider } from '../../providers/key/key';
import { ProfileProvider } from '../../providers/profile/profile';

@Component({
  selector: 'wallet-group-selector',
  templateUrl: 'wallet-group-selector.html'
})
export class WalletGroupSelectorComponent {
  private deregisterBackButtonAction;

  public slideIn: boolean;
  public walletsGroups: any[];
  public selectedIndex: number;
  public selectedWalletGroup;

  constructor(
    private events: Events,
    private platform: Platform,
    private keyProvider: KeyProvider,
    private navCtrl: NavController,
    private profileProvider: ProfileProvider
  ) {
    this.slideIn = false;
  }

  public async present(): Promise<void> {
    this.selectedWalletGroup = this.profileProvider.getWalletGroup(
      this.keyProvider.activeWGKey
    );

    const walletsGroups = _.values(
      _.mapValues(this.profileProvider.walletsGroups, (value: any, key) => {
        value.key = key;
        return value;
      })
    );
    this.walletsGroups = _.sortBy(walletsGroups, 'order');
    await Observable.timer(50).toPromise();
    this.slideIn = true;
    this.overrideHardwareBackButton();
  }

  public dismiss() {
    this.slideIn = false;
    this.deregisterBackButtonAction();
  }

  overrideHardwareBackButton() {
    this.deregisterBackButtonAction = this.platform.registerBackButtonAction(
      () => this.dismiss()
    );
  }

  ngOnDestroy() {
    this.deregisterBackButtonAction();
  }

  public setActiveWalletGroup(selectedWalletGroup): void {
    this.dismiss();
    this.keyProvider.setActiveWGKey(selectedWalletGroup.key);
    this.events.publish('Local/WalletListChange');
  }

  public goToAddWalletPage(): void {
    this.navCtrl.push(AddWalletPage).then(() => {
      this.dismiss();
    });
  }
}