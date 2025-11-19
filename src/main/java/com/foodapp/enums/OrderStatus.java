package com.foodapp.enums;

public enum OrderStatus {
    /**
     * Order is placed by User but not yet touched by Seller.
     * User CAN cancel at this stage.
     */
    PENDING,

    /**
     * Seller has clicked "Accept".
     * User CANNOT cancel anymore. Kitchen is cooking.
     */
    IN_PROGRESS,

    /**
     * Seller has clicked "Mark as Ready".
     * User should go to the counter.
     */
    READY_FOR_PICKUP,

    /**
     * User has picked up the food.
     * Transaction is finished and moves to "History".
     */
    COMPLETED,

    /**
     * Order was cancelled by User (while Pending)
     * OR rejected by Seller.
     */
    CANCELLED
}
