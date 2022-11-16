public with sharing class GetProductList {
    @AuraEnabled(cacheable=true)
        public static List<Opportunity> getProductList() {
            return [SELECT Products__c FROM Opportunity where id = '0065i000007TH2yAAG'];
        }

        @AuraEnabled
        public static void save(String products) {
          Opportunity opp =  [SELECT Products__c FROM Opportunity where id = '0065i000007TH2yAAG'];
          system.debug('list' + opp);
          opp.Products__c = products;
          update opp;
        }
}