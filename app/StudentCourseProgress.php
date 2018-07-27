<?php

namespace WebChange;

use Illuminate\Database\Eloquent\Model;

class StudentCourseProgress extends Model
{
    protected $fillable = ['course_id', 'user_id', 'data'];

    protected $casts = [
        'data' => 'array',
    ];

    /**
     * Get the user that owns the progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function finishActivity($activityName)
    {
        if ($this->isActivityFinished($activityName)) {
            return;
        }

        $this->addTo('finishedActivities', $activityName);
    }

    public function enableLocation($locationName)
    {
        $this->addTo('availableLocations', $locationName);
    }

    private function addTo($key, $value)
    {
        $this->changeData(function ($data) use ($key, $value) {
            $data[$key][] = $value;
            return $data;
        });
    }

    private function changeData($callable)
    {
        $this->data = $callable($this->data);
    }

    private function isActivityFinished($activityName)
    {
        return in_array($activityName, $this->data['finishedActivities'] ?? []);
    }
}
