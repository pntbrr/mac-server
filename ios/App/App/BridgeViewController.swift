//
//  BridgeViewController.swift
//  App
//
//  Created by Ponk on 27/12/2021.
//

import Foundation
import UIKit
import Capacitor

class BridgeViewController: CAPBridgeViewController{
    override func viewDidLoad() {
        super.viewDidLoad()
//        self.webView?.load(URLRequest(url: URL(string: "capacitor://localhost/sundial")!))
//        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
//            UIAccessibility.requestGuidedAccessSession(enabled: true) { success in
//                print(success)
//            }
//        }
    }
    override var prefersStatusBarHidden: Bool {
        return true
    }
}
